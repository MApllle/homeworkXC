import React from "react";
import Taro, { useLoad, useShareAppMessage } from "@tarojs/taro";
import { AtIcon, AtButton } from "taro-ui";
import { Checkbox, Input, View, ScrollView, Text } from "@tarojs/components";
import "./todolist.scss";

const AllStstus = {
  0: "unsort",
  1: "acc",
  2: "desc",
};

export default function Todolist() {
  const [todoList, setTodoList] = React.useState([]);
  const [checkedList, setcheckedList] = React.useState([]);
  const [sortStstus, setsortStstus] = React.useState(AllStstus[0]);
  const $inputRef = React.useRef(null);

  useLoad(() => {
    const newTodoList = Taro.getStorageSync("todoList");
    if (newTodoList) {
      setTodoList(newTodoList);
    }
    const newCheckedList = Taro.getStorageSync("checkedList");
    if (newCheckedList) {
      setcheckedList(newCheckedList);
    }
  });

  const createTodo = (text) => {
    return {
      text,
      checked: false,
      isImportant: false,
    };
  };
  const onAddTodo = () => {
    const targetValue = $inputRef.current?.value;
    if (!!todoList.find((item) => item.text === targetValue)) {
      return Taro.showToast({ title: "已经存在该代办事项事项", icon: "none" });
    }
    const newTodoList = [...todoList, createTodo(targetValue)];
    setTodoList(newTodoList);
    Taro.setStorageSync("todoList", newTodoList);
    $inputRef.current.value = "";
  };

  const onDelTodo = (index, isChecked = false) => {
    if (!isChecked) {
      todoList.splice(index, 1);
      setTodoList([...todoList]);
      Taro.setStorageSync("todoList", todoList);
    } else {
      checkedList.splice(index, 1);
      setcheckedList([...checkedList]);
      Taro.setStorageSync("checkedList", checkedList);
    }
  };

  const onChecked = (index) => {
    const newTodoList = [...todoList];
    newTodoList[index].checked = !newTodoList[index].checked;
    if (newTodoList[index].checked === true) {
      const item = newTodoList.splice(index, 1);
      checkedList.unshift(item[0]);
    }
    setcheckedList([...checkedList]);
    setTodoList(newTodoList);
    Taro.setStorageSync("todoList", newTodoList);
    Taro.setStorageSync("checkedList", checkedList);
  };

  const onUnChecked = (index) => {
    //原来是important，总是会插入到第一个important 原来是unimportant 总是会插入到最后一个unimportant
    const newCheckedList = [...checkedList];
    newCheckedList[index].checked = !newCheckedList[index].checked;
    if (newCheckedList[index].checked === false) {
      const item = newCheckedList.splice(index, 1);
      if (item[0].isImportant) {
        const importantIndex = todoList.findIndex(
          (staritem) => staritem.isImportant
        );
        todoList.splice(importantIndex, 0, item[0]);
      } else {
        const unImportantIndex = todoList.findLastIndex(
          (staritem) => !staritem.isImportant
        );
        todoList.splice(unImportantIndex+1, 0, item[0]);
      }
    }
    setTodoList([...todoList]);
    setcheckedList(newCheckedList);
    Taro.setStorageSync("todoList", todoList);
    Taro.setStorageSync("checkedList", newCheckedList);
  };

  const onStarTodo = (index) => {
    const newTodoList = [...todoList];
    newTodoList[index].isImportant = !newTodoList[index].isImportant;
    if (
      newTodoList[index].isImportant === true &&
      sortStstus === AllStstus[1]
    ) {
      const item = newTodoList.splice(index, 1);
      newTodoList.unshift(item[0]);
    } else if (
      newTodoList[index].isImportant === true &&
      sortStstus === AllStstus[2]
    ) {
      const item = newTodoList.splice(index, 1);
      newTodoList.push(item[0]);
    } else if (
      newTodoList[index].isImportant === false &&
      (sortStstus === AllStstus[1] || sortStstus === AllStstus[2])
    ) {
      const item = newTodoList.splice(index, 1);
      const nonImportantIndex = newTodoList.findIndex(
        (delitem) => !delitem.isImportant
      );
      newTodoList.splice(nonImportantIndex, 0, item[0]);
    }
    setTodoList(newTodoList);
    Taro.setStorageSync("todoList", newTodoList);
  };

  const onStarCheckedTodo = (index) => {
    const newCheckedList = [...checkedList];
    newCheckedList[index].isImportant = !newCheckedList[index].isImportant;
    setcheckedList(newCheckedList);
    Taro.setStorageSync("checkedList", newCheckedList);
  };

  const onChangeSort = () => {
    if (sortStstus === AllStstus[0]) {
      //未排序->升序
      const newTodoList = [...todoList];
      newTodoList.sort((a, b) => {
        if (a.isImportant === b.isImportant) {
          return 0;
        } else if (a.isImportant) {
          return -1;
        } else {
          return 1;
        }
      });
      setTodoList(newTodoList);
      setsortStstus(AllStstus[1]);
    } else if (sortStstus === AllStstus[1]) {
      //升序->降序
      const newTodoList = [...todoList];
      newTodoList.sort((a, b) => {
        if (a.isImportant === b.isImportant) {
          return 0;
        } else if (a.isImportant) {
          return 1;
        } else {
          return -1;
        }
      });
      setTodoList(newTodoList);
      setsortStstus(AllStstus[2]);
    } else {
      setTodoList(todoList);
      setsortStstus(AllStstus[0]);
    }
  };

  useShareAppMessage(() => {
    return {
      title: "这里有一个好用的TodoList，快来看看吧！",
      path: "/pages/todolist/todolist",
    };
  });

  return (
    <View className='main-container'>
      <ScrollView className='todo-container' scrollY='true'>
        <View className='todo-top'>
          <Text className='todo-title'>我的Todo</Text>
          {process.env.TARO_ENV === "weapp" && (
            <AtButton
              className='share-btn'
              type='secondary'
              size='small'
              circle='true'
              openType='share'
            >
              分享Todo小程序
            </AtButton>
          )}
        </View>
        <View className='options'>
          <AtButton
            className='sort-btn'
            type='primary'
            size='small'
            circle='true'
            onClick={onChangeSort}
          >
            {sortStstus === AllStstus[1]
              ? "↓"
              : sortStstus === AllStstus[2]
              ? "↑"
              : ""}
            按重要性排序
          </AtButton>
          <AtButton
            className='cancel-btn'
            type='secondary'
            size='small'
            circle='true'
            onClick={() => setsortStstus(AllStstus[0])}
          >
            取消排序
          </AtButton>
        </View>
        {todoList.map((item, index) => {
          return (
            <View key={index} className='todo-item'>
              <View
                className='left-item'
                onClick={() => {
                  onChecked(index);
                }}
                style={{
                  textDecoration: item.checked ? "line-through" : "none",
                }}
              >
                <Checkbox
                  checked={item.checked}
                />
                {item.text}
              </View>
              <View className='right-item'>
                <AtIcon
                  value={item.isImportant ? "star-2" : "star"}
                  size='25'
                  color={item.isImportant ? "yellow" : "grey"}
                  onClick={() => onStarTodo(index)}
                  style={{ marginRight: "20px" }}
                />
              </View>
              <View className='right-item'>
                <AtIcon
                  value='close'
                  size='20'
                  color='#336699'
                  onClick={() => onDelTodo(index)}
                />
              </View>
            </View>
          );
        })}
        <View className='checked-title'>已完成的Todo</View>
        {checkedList.map((item, index) => {
          return (
            <View key={index} className='checked-item'>
              <View
                className='left-item'
                onClick={() => {
                  onUnChecked(index);
                }}
                style={{
                  textDecoration: "line-through",
                  color: "grey",
                }}
              >
                <Checkbox checked={item.checked} />
                {item.text}
              </View>
              <View className='right-item'>
                <AtIcon
                  value={item.isImportant ? "star-2" : "star"}
                  size='25'
                  color={item.isImportant ? "yellow" : "grey"}
                  onClick={() => onStarCheckedTodo(index)}
                  style={{ marginRight: "20px" }}
                />
              </View>
              <View className='right-item'>
                <AtIcon
                  value='close'
                  size='20'
                  color='#336699'
                  onClick={() => onDelTodo(index, true)}
                />
              </View>
            </View>
          );
        })}
      </ScrollView>
      <View className='todo-submit'>
        <Input className='todo-input' ref={$inputRef} />
        <AtIcon value='check' size='30' color='#000' onClick={onAddTodo} />
        {/* <Button className='todo-bin' onClick={onAddTodo} >提交</Button> */}
      </View>
    </View>
  );
}
