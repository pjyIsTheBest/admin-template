import btnAuth from "./btnAuth";
const install = (app) => {
    app.directive(btnAuth.name, btnAuth.directive)
}
export default install