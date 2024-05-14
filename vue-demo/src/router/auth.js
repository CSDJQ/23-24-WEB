// 在登录成功后保存用户登录状态到 sessionStorage  
export const login = () => {  
    sessionStorage.setItem('isAuthenticated', 'true'); // 直接存储字符串 'true'  
}  
  
// 在用户注销或退出登录时移除登录状态  
export const logout = () => {  
    sessionStorage.removeItem('isAuthenticated');  
}  
  
// 导航守卫函数，用于检查用户登录状态  
export const requireAuth = (to, from, next) => {  
    // 获取 sessionStorage 中的登录状态，这里不需要使用 JSON.parse  
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';  
    if (!isAuthenticated) {  
        // 如果用户未登录，则重定向到登录页面  
        next('/index');  
    } else {  
        // 如果用户已登录，则允许访问成功登录的页面  
        next();  
    }  
};