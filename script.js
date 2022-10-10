const COMMON_CLASSES = {
  FA_SHARP: "fa-sharp",
  FA_SOLID: "fa-solid",
  FA_REGULAR: "fa-regular",
};

const CARET_CLASSES = {
  CUSTOM: "item-expansion",
  RIGHT_CARET: "fa-caret-right",
  DOWN_CARET: "fa-caret-down",
};

const CHECKBOX_CLASSES = {
  CUSTOM: "item-selection",
  UNCHECK_OR_PARTIAL: "fa-square",
  CHECK: "fa-square-check",
};

const CHECKBOX_STATES = {
  UNSELECTED: 0,
  SELECTED: 1,
  PARTIAL: 2,
};

const EXPANSION_STATES = {
  HIDE: 0,
  UNHIDE: 1,
};

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
  {
    title: "Node3",
    value: "0-2",
    key: "0-2",
    children: [
      {
        title: "Child Node6",
        value: "0-2-0",
        key: "0-2-0",
      },
    ],
  },
];

function getChildCountHelper(data) {
  let count = 0;
  if (data.children) {
    for (let i = 0; i < data.children.length; i++) {
      const tempCount = getChildCountHelper(data.children[i]);
      if (tempCount == 1) {
        data.children[i].childCount = 0;
      } else {
        data.children[i].childCount = tempCount;
      }
      count += tempCount;
    }
    return count;
  } else {
    return 1;
  }
}

function getChildCount() {
  const datas = JSON.parse(JSON.stringify(treeData));
  for (let i = 0; i < datas.length; i++) {
    datas[i].childCount = 0;
    if (datas[i].children) {
      datas[i].childCount = getChildCountHelper(datas[i]);
    }
  }
  return datas;
}

/*
  floag->0 means 'unselect'
  floag->1 means 'select'
  floag->2 means 'partial'
 */
function checkboxIconClassAssignment(flag, icon) {
  icon.className = "";
  icon.classList.add(CHECKBOX_CLASSES.CUSTOM);
  if (flag === CHECKBOX_STATES.UNSELECTED) {
    icon.classList.add(
      CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL,
      COMMON_CLASSES.FA_REGULAR
    );
  } else if (flag === CHECKBOX_STATES.SELECTED) {
    icon.classList.add(COMMON_CLASSES.FA_REGULAR, CHECKBOX_CLASSES.CHECK);
  } else if (flag === CHECKBOX_STATES.PARTIAL) {
    icon.classList.add(
      CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL,
      COMMON_CLASSES.FA_SOLID
    );
  }
}

/*
  floag->0 means show hide icon
  floag->1 means show unhide icon
 */
function expansionIconClassAssignment(flag, icon) {
  if (!icon.classList.contains(CARET_CLASSES.CUSTOM)) {
    icon.classList.add(CARET_CLASSES.CUSTOM);
  }
  if (!icon.classList.contains(COMMON_CLASSES.FA_SHARP)) {
    icon.classList.add(COMMON_CLASSES.FA_SHARP);
  }
  if (!icon.classList.contains(COMMON_CLASSES.FA_SOLID)) {
    icon.classList.add(COMMON_CLASSES.FA_SOLID);
  }

  if (flag === EXPANSION_STATES.HIDE) {
    icon.classList.remove(CARET_CLASSES.DOWN_CARET);
    icon.classList.add(CARET_CLASSES.RIGHT_CARET);
  } else if (flag === EXPANSION_STATES.UNHIDE) {
    icon.classList.remove(CARET_CLASSES.RIGHT_CARET);
    icon.classList.add(CARET_CLASSES.DOWN_CARET);
  }
}

function insertToDOM(queue, parent, data) {
  const liItem = document.createElement("li");
  const divItem = document.createElement("div");
  divItem.classList.add("item");

  const icon1 = document.createElement("i");
  icon1.classList.add(CARET_CLASSES.CUSTOM);

  const icon2 = document.createElement("i");
  checkboxIconClassAssignment(CHECKBOX_STATES.UNSELECTED, icon2);

  const title = document.createElement("p");
  title.classList.add("item-title");
  title.textContent = data.title;

  divItem.append(icon1, icon2, title);
  liItem.append(divItem);
  if (data.children) {
    expansionIconClassAssignment(EXPANSION_STATES.UNHIDE, icon1);
    queue.push([liItem, data]);
  }
  parent.append(liItem);
}

function constructData() {
  // const treeData = getChildCount()
  const queue = [];
  for (let i = 0; i < treeData.length; i++) {
    insertToDOM(queue, itemContainer, treeData[i]);
  }

  while (queue.length > 0) {
    const [node, data] = queue.shift();
    if (data.children) {
      const ulItem = document.createElement("ul");
      ulItem.classList.add("items");
      let childCount = 0
      for (const child of data.children) {
        insertToDOM(queue, ulItem, child);
        childCount++
      }

      node.dataset.totalChildren = childCount;
      node.dataset.totalSelectedChildren = 0;
      node.append(ulItem);
    }
  }
}

constructData(); 

function propagateSelectionToParent(element) {
  checkboxIconClassAssignment(CHECKBOX_STATES.SELECTED, element);
  if (
    element.parentElement &&
    element.parentElement.parentElement &&
    element.parentElement.parentElement.parentElement &&
    element.parentElement.parentElement.parentElement.parentElement
  ) {
    if (
      element.parentElement.parentElement.parentElement.classList.contains(
        "itemsRoot"
      )
    )
      return;
    const dataContainerNode =
      element.parentElement.parentElement.parentElement.parentElement;

    
    dataContainerNode.dataset.totalSelectedChildren = `${
      +dataContainerNode.dataset.totalSelectedChildren + 1
    }`;

    const selectionNodeOfDataContainer =
      dataContainerNode.firstElementChild.querySelector(
        `.${CHECKBOX_CLASSES.CUSTOM}`
      );

    checkboxIconClassAssignment(
      CHECKBOX_STATES.PARTIAL,
      selectionNodeOfDataContainer
    );

    if (
      dataContainerNode.dataset.totalSelectedChildren ===
      dataContainerNode.dataset.totalChildren
    ) {
      propagateSelectionToParent(selectionNodeOfDataContainer);
    }
  }
}

function propagateUnselectionToParent(element, currState) {
  if (element) checkboxIconClassAssignment(currState, element);
  if (
    element.parentElement &&
    element.parentElement.parentElement &&
    element.parentElement.parentElement.parentElement &&
    element.parentElement.parentElement.parentElement.parentElement
  ) {
    if (
      element.parentElement.parentElement.parentElement.classList.contains(
        "itemsRoot"
      )
    )
      return;
    const dataContainerNode =
      element.parentElement.parentElement.parentElement.parentElement;
    let totalSelectedChildren =
      +dataContainerNode.dataset.totalSelectedChildren;
    if (totalSelectedChildren === 0) return;

    totalSelectedChildren--;
    dataContainerNode.dataset.totalSelectedChildren = totalSelectedChildren;

    const selectionNodeOfDataContainer =
      dataContainerNode.firstElementChild.querySelector(
        `.${CHECKBOX_CLASSES.CUSTOM}`
      );

    propagateUnselectionToParent(
      selectionNodeOfDataContainer,
      +totalSelectedChildren === 0
        ? CHECKBOX_STATES.UNSELECTED
        : CHECKBOX_STATES.PARTIAL
    );
  }
}

function propagateSelectionToChild(element) {
  //upward movement
  propagateSelectionToParent(element);

  //downard movement
  const queue = [];
  const parent = element.parentElement.parentElement;
  parent.dataset.totalSelectedChildren = parent.dataset.totalChildren;
  const child = parent.querySelector(".items");
  queue.push(child);

  while (queue.length > 0) {
    const ulNode = queue.shift();
    for (const liNode of ulNode.children) {
      const selectIcon = liNode.querySelector(`.${CHECKBOX_CLASSES.CUSTOM}`);
      checkboxIconClassAssignment(CHECKBOX_STATES.SELECTED, selectIcon);
      const childOfLiNode = liNode.querySelector(".items");
      if (childOfLiNode) {
        liNode.dataset.totalSelectedChildren = liNode.dataset.totalChildren;
        queue.push(childOfLiNode);
      }
    }
  }
}

function propagateUnselectionToChild(element) {
  //upward movement
  propagateUnselectionToParent(element, CHECKBOX_STATES.UNSELECTED);

  //downard movement
  const queue = [];
  const parent = element.parentElement.parentElement;
  parent.dataset.totalSelectedChildren = 0;
  const child = parent.querySelector(".items");
  queue.push(child);

  while (queue.length > 0) {
    const ulNode = queue.shift();
    for (const liNode of ulNode.children) {
      const selectIcon = liNode.querySelector(`.${CHECKBOX_CLASSES.CUSTOM}`);
      checkboxIconClassAssignment(CHECKBOX_STATES.UNSELECTED, selectIcon);
      const childOfLiNode = liNode.querySelector(".items");
      if (childOfLiNode) {
        liNode.dataset.totalSelectedChildren = 0;
        queue.push(childOfLiNode);
      }
    }
  }
}

itemContainer.addEventListener("click", (evt) => {
  if (
    evt.target.classList.contains(CARET_CLASSES.RIGHT_CARET) ||
    evt.target.classList.contains(CARET_CLASSES.DOWN_CARET)
  ) {
    if (evt.target.classList.contains(CARET_CLASSES.RIGHT_CARET)) {
      expansionIconClassAssignment(EXPANSION_STATES.UNHIDE, evt.target);
    } else {
      expansionIconClassAssignment(EXPANSION_STATES.HIDE, evt.target);
    }
    const parent = evt.target.parentElement.parentElement;
    const children = parent.querySelector(".items");
    children.classList.toggle("hide");
  } else if (
    evt.target.classList.contains(CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL) ||
    evt.target.classList.contains(CHECKBOX_CLASSES.CHECK)
  ) {
    if (evt.target.classList.contains(CHECKBOX_CLASSES.UNCHECK_OR_PARTIAL)) {
      const parent = evt.target.parentElement.parentElement;
      //unselected state
      if (evt.target.classList.contains(COMMON_CLASSES.FA_REGULAR)) {
        if (
          parent.dataset.totalSelectedChildren &&
          parent.dataset.totalChildren
        ) {
          propagateSelectionToChild(evt.target);
        } else {
          propagateSelectionToParent(evt.target);
        }
      }
      //partially selected state
      else {
        propagateSelectionToChild(evt.target);
      }
    } else {
      // 1.propage upwards to decrement the selected child count of the parent
      // 2.propaget downwards to unselect all the children
      // checkboxIconClassAssignment(CHECKBOX_STATES.UNSELECTED, evt.target);

      const parent = evt.target.parentElement.parentElement;
      if (
        parent.dataset.totalSelectedChildren &&
        parent.dataset.totalChildren
      ) {
        propagateUnselectionToChild(evt.target);
      } else {
        propagateUnselectionToParent(evt.target, CHECKBOX_STATES.UNSELECTED);
      }
    }
  }
});
