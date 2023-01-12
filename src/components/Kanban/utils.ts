import Fuse from 'fuse.js'

export function switchElsPositionByIndex(
  arr: any[],
  first: number,
  second: number
): any[] {
  let temp = [...arr];
  temp[first] = arr[second];
  temp[second] = arr[first];
  return temp;
}

export function changeElPositionByIndex(
  arr: any[],
  currPos: number,
  targetPos: number
): any[] {
  const temp = [...arr]
  const element = temp.splice(currPos, 1)[0];
  temp.splice(targetPos, 0, element);
  return temp;
}

export function getElementXAxisCenter(el: Element): number {
  const offsetEl = el && el.getBoundingClientRect();
  const xAxisElCenter = offsetEl.left + offsetEl.width / 2;
  return xAxisElCenter;
}

export function checkElementsPosition(first: Element, second: Element): boolean {
  if (!(first && second)) return false;
  const firstXCenter = getElementXAxisCenter(first);
  const secondXCenter = getElementXAxisCenter(second);
  if (firstXCenter < secondXCenter || firstXCenter > secondXCenter) return true;
  return false;
}

export function getRelativePosition(mx: number, my: number, el: Element): { x: number; y: number } {
  const rect = el.getBoundingClientRect();
  return { x: mx - rect.left, y: my - rect.top }
}

export function getMousePosition(ev): { x: number; y: number } {
  let pos = { x: 0, y: 0 };
  pos.x = ev.clientX;
  pos.y = ev.clientY;
  return pos;
}

export function changeElementPosition(pos, node, relative): void {
  if (pos && node && relative) {
    node.style.left = `${pos.x - relative.x}px`;
    node.style.top = `${pos.y + relative.y}px`;
  }
}

let [oldx, oldy] = [0, 0];
let [xDir, yDir] = ["", ""];
export function getMouseDirection(ev): { x: string, y: string } {
  if (ev.pageX < oldx) xDir = "left";
  if (ev.pageX > oldx) xDir = "right";
  if (ev.pageY < oldy) yDir = "up";
  if (ev.pageY > oldy) yDir = "down";
  [oldx, oldy] = [ev.pageX, ev.pageY];
  return { x: xDir, y: yDir };
}

export function returnInitialsNames(name: string): string {
  const splitted = name.split(" ");
  const first = splitted[0].charAt(0);
  const last = splitted[splitted.length - 1].charAt(0);
  return first + last;

}


export function checkIfItemIsInArray(item, arr): { isInIt: boolean; index: number } {
  let isInIt = false;
  let index = -1;
  for (var i = 0; i < arr.length; i++) {
    if (JSON.stringify(item) === JSON.stringify(arr[i])) {
      [isInIt, index] = [true, i];
      break;
    }
  };
  return { isInIt, index };
}

export function getCaretCharacterOffsetWithin(element) {
  let caretOffset = 0;
  const doc = element.ownerDocument || element.document;
  const win = doc.defaultView || doc.parentWindow;
  let sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      const range = win.getSelection().getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ((sel = doc.selection) && sel.type != "Control") {
    const textRange = sel.createRange();
    const preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}

function createRange(node, chars, range?) {
  if (!range) {
    range = document.createRange()
    range.selectNode(node);
    range.setStart(node, 0);
  }

  if (chars.count === 0) {
    range.setEnd(node, chars.count);
  } else if (node && chars.count > 0) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent.length < chars.count) {
        chars.count -= node.textContent.length;
      } else {
        range.setEnd(node, chars.count);
        chars.count = 0;
      }
    } else {
      for (let lp = 0; lp < node.childNodes.length; lp++) {
        range = createRange(node.childNodes[lp], chars, range);

        if (chars.count === 0) {
          break;
        }
      }
    }
  }
  return range;
};

export function setCurrentCursorPosition(chars, node) {
  if (chars >= 0) {
    const selection = window.getSelection();
    const range = createRange(node, { count: chars });
    if (range) {
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
};

export function getFilenameFromUrl(url: string): string {
  return url.substring(url.lastIndexOf('/') + 1);
}

export function getCover(atts): string {
  if (!atts) return ""
  for (let index = 0; index < atts.length; index++) {
    if (atts[index].isCover) return atts[index].url
  };
  return "";
}

export function isImage(url: string): boolean {
  return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export function dateObjToHtmlString(date: Date, locale: "pt-BR"): string {
  if (!date) return "";
  var tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
  const nDate = new Date(date.getTime() - tzoffset).toISOString();
  return nDate.slice(0, 16);
}

export function removeDuplicates(arr: any[]): any[] {
  const uniqueArray = arr.filter((value, index) => {
    const _value = JSON.stringify(value);
    return index === arr.findIndex(obj => {
      return JSON.stringify(obj) === _value;
    });
  });
  return uniqueArray;
}

export function filterHTMLElements(
  htmlEls: NodeList,
  searchable: any[],
  searchQuery: string,
  collection: any[]
): void {
  for (let i = 0; i < htmlEls.length; i++) {
    const el = htmlEls[i];
    // @ts-ignore
    el.style.display = "none";
    let matched = false;
    let term = "";
    searchable.forEach((key) => {
      if (!collection[i][key]) return;
      const str = JSON.stringify(collection[i][key]);
      const text = str.replace(/["']([^"']+)["']:|[#]|null/g, "");
      term = `${term}${text.toLowerCase()}`;
    })
    if (term.match(searchQuery.toLowerCase())) matched = true;
    // @ts-ignore
    if (matched || !searchQuery) el.style.display = "";
  }
}

export function isSameDay(date1: Date, date2: Date): boolean {
  if (!date1 || !date2) return;
  return date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear();
}

export function isToday(date: Date): boolean {
  let today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

export function fuzzySearch(list: any[], pattern: string): any[] {
  const all = JSON.parse(JSON.stringify(list));
  const options = {
    includeScore: true,
    includeMatches: true,
    threshold: 0.1,
    useExtendedSearch: true,
    keys: [
      "title",
      "desc",
      "checklists.title",
      "checklists.items.title",
    ]
  };
  const fuse = new Fuse(all, options);
  return fuse.search(pattern);
}

