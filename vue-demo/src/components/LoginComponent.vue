<template>
    <div class="ring">
        <i style="--clr:#FF5AA5;"></i>
        <i style="--clr:#FFD4A3;"></i>
        <i style="--clr:#60AEFF;"></i>
        <div class="login">
            <h2>{{ type ? 'Login' : 'Register' }}</h2>
              <div class="inputBx">
                <input type="text" placeholder="Username" v-model="username"  @focus="handleFocus">
              </div>
              <div class="inputBx">
                <input type="password" placeholder="Password" v-model="password"  @focus="handleFocus">
              </div>
              <div class="inputBx" v-if="!type">
                <input type="password" placeholder="Check Password" v-model="checkPassword"  @focus="handleFocus">
              </div>
              <div class="inputBx">
                <input type="submit" :value="type ? 'Sign in':'Sign up'" @click="submit">
              </div>
            <div class="links">
            <a href="#" @click.prevent="changeSign()">{{!type ? 'Sign in':'Sign up'}}</a>
            <em v-if="unmatch">{{ tip }}</em>
            </div>
        </div>
    </div>
</template>

<script>
import { login } from '../router/auth';
export default {
  data(){
    return {
      type: true,
      unmatch: false,
      username: '',
      password: '',
      checkPassword: '',
      tip:'',
    }
  },
  methods:{
    changeSign(){
      this.type = !this.type;
      this.username = '';
      this.password = '';
      this.checkPassword = '';
      this.unmatch = false;
    },
    submit() {
      if(this.username == ''){
        this.tip = '用户名不能为空';
        this.unmatch = true;
        return;
      }
      if (!this.type) {
        // register
        if(this.password != this.checkPassword){
          this.tip = '确认密码不匹配！';
          this.unmatch = true;
          this.checkPassword = '';
          return;
        }else{
          // 注册逻辑
          const url = '/api/regist?username='+this.username+'&pwd='+this.password;
          fetch(url)
          .then(response => response.text())
          .then(data => {
            if(data === 'true'){
              this.changeSign();
              this.tip = '注册成功，请登录';
              this.unmatch = true;
              this.username = '';
              this.password = '';
              this.checkPassword = '';
            }else{
              this.tip = '用户名冲突，注册失败！';
              this.unmatch = true;
              this.password = '';
              this.checkPassword = '';
            }
            console.log(data);
            console.log('yes');
          })
        }
      }else{
        // login
        const url = '/api/login?username='+this.username+'&pwd='+this.password;
        //登录逻辑
        fetch(url)
          .then(response => response.text())
          .then(data => {
            if(data === 'true'){
              sessionStorage.setItem('username',this.username);
              this.$router.push('/index');
              login();
            }else{
              this.tip = '用户不存在或密码错误！';
              this.unmatch = true;
              this.password = '';
              this.checkPassword = '';
            }
          })
      }
    },
    handleFocus(){
      this.unmatch = false;
    },
  },
  mounted() {  
    document.body.classList.add('login-body');  
  },  
  beforeUnmount() {  
    document.body.classList.remove('login-body');  
  },  
};  
</script> 

<style>
.login-body {
display: flex;
justify-content: center;
align-items: center;
min-height: 100vh;
background: #081d32;
width: 100%;
overflow: hidden;
}
</style>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300&display=swap");

.ring {
  position: relative;
  width: 500px;
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.ring i {
  position: absolute;
  inset: 0;
  border: 2px solid #fff;
  transition: 0.5s;
}
.ring i:nth-child(1) {
  border-radius: 38% 62% 63% 37% / 41% 44% 56% 59%;
  animation: animate 6s linear infinite;
}
.ring i:nth-child(2) {
  border-radius: 41% 44% 56% 59%/38% 62% 63% 37%;
  animation: animate 4s linear infinite;
}
.ring i:nth-child(3) {
  border-radius: 41% 44% 56% 59%/38% 62% 63% 37%;
  animation: animate2 10s linear infinite;
}
.ring:hover i {
  border: 6px solid var(--clr);
  filter: drop-shadow(0 0 20px var(--clr));
}
@keyframes animate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
@keyframes animate2 {
  0% {
    transform: rotate(360deg);
  }
  100% {
    transform: rotate(0deg);
  }
}
.login {
  position: absolute;
  width: 300px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  /* gap: 20px; */
}
.login h2 {
  font-size: 2em;
  color: #fff;
  margin-bottom: 20px;
}
.login .inputBx {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}
.login .inputBx input {
  position: relative;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: 2px solid #fff;
  border-radius: 40px;
  font-size: 1.2em;
  color: #fff;
  box-shadow: none;
  outline: none;
}
.login .inputBx input[type="submit"] {
  width: 100%;
  background: #0078ff;
  background: linear-gradient(45deg, #6D00FF, #60AEFF);
  border: none;
  cursor: pointer;
}
.login .inputBx input::placeholder {
  color: rgba(255, 255, 255, 0.75);
}

.login .links {
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}
.login .links a {
  color: #fff;
  text-decoration: none;
}
.login .links em {
  color: rgb(255, 94, 94);
}

</style>