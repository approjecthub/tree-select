const RIGHT_CARET_CLASS = "fa-caret-right";
const DOWN_CARET_CLASS = "fa-caret-down";
// const CHECKBOX_PARTIAL_UNICODE = "&#128307;";
// const CHECKBOX_UNSELECT_UNICODE = "&#11036;";
const CHECKBOX_PARTIAL_HTML = '<i class="fa-solid fa-square"></i>'
const CHECKBOX_UNSELECT_HTML = '<i class="fa-regular fa-square"></i>'
const CHECKBOX_SELECT_HTML = '<i class="fa-regular fa-square-check"></i>';

const itemContainer = document.getElementById("rootItem");

const treeData = [
  {
    title: "Node1",
    value: "0-0",
    key: "0-0",
  },
  {
    title: "Node2",
    value: "0-1",
    key: "0-1",
    children: [
      {
        title: "Child Node3",
        value: "0-1-0",
        key: "0-1-0",
      },
      {
        title: "Child Node4",
        value: "0-1-1",
        key: "0-1-1",
        children: [
          {
            title: "Child Node4-0",
            value: "0-1-1-0",
            key: "0-1-1-0",
          },
          {
            title: "Child Node4-1",
            value: "0-1-1-1",
            key: "0-1-1-1",
          },
        ],
      },
      {
        title: "Child Node5",
        value: "0-1-2",
        key: "0-1-2",
      },
    ],
  },
];

function insertToDOM(queue, parent, data) {
  const liItem = document.createElement("li");
  const divItem = document.createElement("div");
  divItem.classList.add("item");
  const span1 = document.createElement("span");
  span1.classList.add("item-expansion");

  const span2 = document.createElement("span");
  span2.classList.add("item-selection");
  span2.innerHTML = CHECKBOX_UNSELECT_HTML;

  const span3 = document.createElement("div");
  span3.classList.add("item-title");
  span3.textContent = data.title;

  divItem.append(span1, span2, span3);
  liItem.append(divItem);
  if (data.children) {
    span1.innerHTML = '<i class="fa-sharp fa-solid fa-caret-right"></i>';
    queue.push([liItem, data]);
  }
  parent.append(liItem);
}

function constructData() {
  const queue = [];
  for (let i = 0; i < treeData.length; i++) {
    insertToDOM(queue, itemContainer, treeData[i]);
  }

  while (queue.length > 0) {
    const [node, data] = queue.shift();
    if (data.children) {
      const ulItem = document.createElement("ul");
      ulItem.classList.add("items");
      for (const child of data.children) {
        insertToDOM(queue, ulItem, child);
      }
      node.append(ulItem);
    }
  }
}

constructData();
itemContainer.addEventListener("click", (evt) => {
  if (
    evt.target.classList.contains(RIGHT_CARET_CLASS) ||
    evt.target.classList.contains(DOWN_CARET_CLASS)
  ) {
    if (evt.target.classList.contains(RIGHT_CARET_CLASS)) {
      evt.target.classList.remove(RIGHT_CARET_CLASS);
      evt.target.classList.add(DOWN_CARET_CLASS);
    } else {
      evt.target.classList.remove(DOWN_CARET_CLASS);
      evt.target.classList.add(RIGHT_CARET_CLASS);
    }
    const parent = evt.target.parentElement.parentElement.parentElement;
    const children = parent.querySelector(".items");
    children.classList.toggle("hide");
  }
  else if(evt.target.classList.contains('fa-square')|| evt.target.classList.contains('fa-square-check')){
    // if(CHECKBOX_UNSELECT_UNICODE.includes(evt.target.innerHTML.codePointAt(0))){
    //   evt.target.innerHTML=CHECKBOX_SELECT_UNICODE
    // }
    if(evt.target.classList.contains('fa-square')){
      evt.target.classList.remove('fa-square')
      evt.target.classList.add('fa-square-check')
    }
    else{
      evt.target.classList.remove('fa-square-check')
      evt.target.classList.add('fa-square')
    }
  }
});
