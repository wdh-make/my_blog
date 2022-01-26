import { ref } from "vue";
import { MENU_LIST } from "@/assets/setting"

function getMenus(name) {
  let temp = name.split("|");
  return {
    name: temp[0],
    path: temp[1],
  };
}

export default function getMenuList() {
  const menuList = ref({})
  let list = MENU_LIST.split(',')
  menuList.value  = list.map((t) => {
    return getMenus(t);
  });
  return {
    menuList
  }
}
