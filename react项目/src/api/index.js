/**
 * 包含应用中所有接口函数的模块
 */
import ajax from "./ajax";
import jsonp from "jsonp";
import { message } from "antd";
//登陆
export const reLogin = (username, password) =>
  ajax("/login", { username, password }, "POST");

//获取一级/二级分类的列表
export const reqCategory = parentId =>
  ajax("/manage/category/list", { parentId });

//添加分类
export const reqAddCategory = (categoryName, parentId) =>
  ajax("/manage/category/add", { categoryName, parentId }, "POST");

//更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) =>
  ajax("/manage/category/update", { categoryId, categoryName }, "POST");

//获取商品的分页列表
export const reqProducts = (pageNum, pageSize) =>
  ajax("/manage/product/list", { pageNum, pageSize });

//搜索产品分页列表

export const reqSearchProducts = ({
  pageNum,
  pageSize,
  searchName,
  searchType
}) =>
  ajax("/manage/product/search", {
    pageNum,
    pageSize,
    [searchType]: searchName
  });
//获取一个分类
export const reqCategoryById = categoryId =>
  ajax("/manage/category/info", { categoryId });

//更新商品的状态

export const reqUpdateStatus = (productId, status) =>
  ajax("/manage/product/updateStatus", { productId, status }, "POST");

//添加商品
export const reqAddProduct = product =>
  ajax("/manage/product/add", product, "POST");

//更新商品
export const reqUpdateProduct = product =>
  ajax("/manage/product/update", product, "POST");

//合并添加or更新商品
export const reqAddOrUpdateProduct = product =>
  ajax("/manage/product/" + (product._id ? "update" : "add"), product, "POST");

//删除图片
export const reqDeleteImg = name =>
  ajax(
    "/manage/img/delete",
    {
      name
    },
    "POST"
  );

//获取所有角色列表
export const reqRoles = () => ajax("/manage/role/list");

//添加角色
export const reqAddRole = roleName =>
  ajax("/manage/role/add", { roleName }, "POST");

//g更新角色
export const reqUpdateRole = role => ajax("/manage/role/update", role, "POST");

//获取所有用户列表
export const reqUsers = () => ajax("/manage/user/list");

//删除指定用户
export const reqDeleteUser = userId =>
  ajax("/manage/user/delete", { userId }, "POST");

// //添加用户
// export const reqAddUser = (user) => ajax('/manage/user/delete',user,'POST')
//添加用户或者更新用户
export const reqAddUserOrUpdateUser = user =>
  ajax("/manage/user/" + (user._id ? "update" : "add"), user, "POST");

//jsonp 请求函数 获取天气信息
export const reWeather = city => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`;
    jsonp(url, {}, (err, data) => {
      if (!err && data.status === "success") {
        const { dayPictureUrl, weather } = data.results[0].weather_data[0];
        resolve({ dayPictureUrl, weather });
      } else {
        message.error("获取天气信息失败");
      }
    });
  });
};
