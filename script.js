const COMMON_CLASSES = {
  FA_SHARP: "fa-sharp",
  FA_SOLID: "fa-solid",
  FA_REGULAR: "fa-regular"
}

const CARET_CLASSES ={
  CUSTOM: "item-expansion",
  RIGHT_CARET: "fa-caret-right",
  DOWN_CARET: "fa-caret-down",
}

const CHECKBOX_CLASSES = {
  CUSTOM: "item-selection",
  UNCHECK_OR_PARTIAL: "fa-square",
  CHECK: "fa-square-check"
}

const CHECKBOX_STATES = {
  UNSELECTED: 0,
  SELECTED: 1,
  PARTIAL: 2
}

const EXPANSION_STATES = {
  HIDE: 0,
  UNHIDE: 1
}

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

/*
  floag->0 means 'unselect'
  floag->1 means 'select'
  floag->2 means 'partial'
 */
  function checkboxIconClassAssignment(flag, icon){
    icon.className=""
    icon.classList.add(CHECKBOX_CLASSES.CUSTOM)
    if(flag===CHECKBOX_STATES.UNSELECTED){
      icon.classList.add(CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL, COMMON_CLASSES.FA_REGULAR);
    }
    else if(flag===CHECKBOX_STATES.SELECTED){
      icon.classList.add(COMMON_CLASSES.FA_REGULAR, CHECKBOX_CLASSES.CHECK);
    }
    else if(flag===CHECKBOX_STATES.PARTIAL){
      icon.classList.add(CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL, COMMON_CLASSES.FA_SOLID);
    }
  }


/*
  floag->0 means show hide icon
  floag->1 means show unhide icon
 */
function expansionIconClassAssignment(flag, icon){
  if(!icon.classList.contains(CARET_CLASSES.CUSTOM)){
    icon.classList.add(CARET_CLASSES.CUSTOM)
  }
  if(!icon.classList.contains(COMMON_CLASSES.FA_SHARP)){
    icon.classList.add(COMMON_CLASSES.FA_SHARP)
  }
  if(!icon.classList.contains(COMMON_CLASSES.FA_SOLID)){
    icon.classList.add(COMMON_CLASSES.FA_SOLID)
  }

  if(flag===EXPANSION_STATES.HIDE){
    icon.classList.remove(CARET_CLASSES.DOWN_CARET)
    icon.classList.add(CARET_CLASSES.RIGHT_CARET);
  }
  else if(flag===EXPANSION_STATES.UNHIDE){
    icon.classList.remove(CARET_CLASSES.RIGHT_CARET);
    icon.classList.add(CARET_CLASSES.DOWN_CARET);
  }
}

function insertToDOM(queue, parent, data) {
  const liItem = document.createElement("li");
  const divItem = document.createElement("div");
  divItem.classList.add("item");

  const icon1 = document.createElement("i");
  icon1.classList.add(CARET_CLASSES.CUSTOM)

  const icon2 = document.createElement("i");
  checkboxIconClassAssignment(CHECKBOX_STATES.UNSELECTED,icon2)

  const title = document.createElement("p");
  title.classList.add("item-title");
  title.textContent = data.title;

  divItem.append(icon1, icon2, title);
  liItem.append(divItem);
  if (data.children) {
    expansionIconClassAssignment(EXPANSION_STATES.UNHIDE, icon1)
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
    evt.target.classList.contains(CARET_CLASSES.RIGHT_CARET) ||
    evt.target.classList.contains(CARET_CLASSES.DOWN_CARET)
  ) {
    if (evt.target.classList.contains(CARET_CLASSES.RIGHT_CARET)) {
      expansionIconClassAssignment(EXPANSION_STATES.UNHIDE, evt.target)
    } else {
      expansionIconClassAssignment(EXPANSION_STATES.HIDE, evt.target)
    }
    const parent = evt.target.parentElement.parentElement;
    const children = parent.querySelector(".items");
    children.classList.toggle("hide");
  }
  else if(evt.target.classList.contains(CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL)|| evt.target.classList.contains(CHECKBOX_CLASSES.CHECK)){
    if(evt.target.classList.contains(CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL)){
      checkboxIconClassAssignment(CHECKBOX_STATES.SELECTED, evt.target)
    }
    else{
      checkboxIconClassAssignment(CHECKBOX_STATES.UNSELECTED, evt.target)
    }
  }
});
