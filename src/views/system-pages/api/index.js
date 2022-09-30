import axios from '../../../util/axios.js'

export default {
    //登录
    login(params) {
        return axios.post("/user/login", params)
    },
    //查询用户菜单
    getMenus(parentId = 0) {
        return axios.get("/menu/findAllByUserAndParentId", { params: { parentId } })
    },
    //根据父节点id查询子节点
    getMenusByParentId(parentId) {
        return axios.get("/menu/findByParentId", { params: { parentId } })
    },
    //节点拖拽
    drop({ draggingId, dropId }) {
        return axios.post("/menu/drop", { draggingId, dropId })
    },
    //查询所有菜单
    getAllMenus() {
        return axios.get("/menu/findAll")
    },
    //新增路由
    addMenu(values) {
        return axios.post("/menu/add", { ...values })
    },
    //修改路由
    updateMenu(values) {
        return axios.post("/menu/update", { ...values })
    },
    //删除路由
    delMenu(id) {
        return axios.post("/menu/delete", { id })
    },
    //查询角色列表
    getRoleList({ name, pageIndex, pageSize }) {
        return axios.get("/role/find", { params: { name, pageIndex, pageSize } })
    },
    //新增角色
    addRole({ name, remarks }) {
        return axios.post("/role/add", { name, remarks })
    },
    //修改角色
    updateRole({ id, name, remarks }) {
        return axios.post("/role/update", { id, name, remarks })
    },
    //删除角色
    delRole(id) {
        return axios.post("/role/delete", { id })
    },
    //变更角色状态
    updateRoleStatus(status, id) {
        return axios.post("/role/updateStatus", { status, id })
    },
    //查询单个角色
    getRoleById(id) {
        return axios.get("/role/findById", { params: { id } })
    },
    //变更角色绑定的菜单id
    updateMenuIds(id, menuIds) {
        return axios.post("/role/updateMenuIds", { menuIds, id })
    },
    //查询用户列表
    getUserList({ account, name, phone, pageIndex, pageSize }) {
        return axios.get("/user/find", { params: { account, name, phone, pageIndex, pageSize } })
    },
    //查询所有角色
    getRoleOptions() {
        return axios.get("/role/findAll")
    },
    //新增用户
    addUser({ account, password, name, phone, role, remarks }) {
        return axios.post("/user/add", { account, password, name, phone, role, remarks })
    },
    //修改用户
    updateUser({ id, account, name, phone, role, remarks }) {
        return axios.post("/user/update", { id, account, name, phone, role, remarks })
    },
    //删除用户
    delUser(id) {
        return axios.post("/user/delete", { id })
    },
    //变更用户状态
    updateUserStatus(id, status) {
        return axios.post("/user/updateStatus", { id, status })
    },
    //修改密码
    changePwd({ oldPwd, newPwd }) {
        return axios.post("/user/changePwd", { oldPwd, newPwd })
    },
    //根据用户权限和父节点id查询对应子节点
    findByUserAndParentId(parentId) {
        return axios.get("/menu/findByUserAndParentId", { params: { parentId } })
    }
}