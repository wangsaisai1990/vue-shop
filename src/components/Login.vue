<template>
    <div class="login_container">
        <div class="login_box">
            <!-- 头像区域-->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域-->
            <el-form ref="LoginFormRef" :model="LoginForm" :rules="LoginFormRules" label-width="0px" class="login_form">
                <el-form-item prop="username">
                    <el-input v-model="LoginForm.username" prefix-icon="iconfont icon-user" placeholder="请输入用户名"></el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="LoginForm.password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" type="password"></el-input>
                </el-form-item>
                <el-form-item class="btns">
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>

</template>
<script>
export default {
    data () {
        return {
          LoginForm: {
            username: 'admin',
            password: '123456'
           },
           LoginFormRules: {
               username: [
                   { required: true, message: '用户名不能为空', trigger: 'blur' },
                   { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
               password: [
                   { required: true, message: '密码不能为空', trigger: 'blur' },
                   { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
           }
         }
     },
     methods: {
         // 点击重置按钮
         resetLoginForm () {
             this.$refs.LoginFormRef.resetFields()
         },
         login () {
             this.$refs.LoginFormRef.validate(async (valid) => {
                 if (!valid) return
                 console.log(valid)
                 const { data: res } = await this.$http.post('login', this.LoginForm)
                 if (res.meta.status !== 200) return this.$message.error('登录失败！')
                 this.$message.success('登录成功!')

                 // 登录成功之后保存token,保存到客户端得sessionstorage中
                 window.sessionStorage.setItem('token', res.data.token)
                 // 登录成功跳转
                 this.$router.push('/home')
             })
         }
     }
}
</script>
<style lang="less" scoped>
    .login_container {
        background-color: #2b4b6b;
        height: 100%;
    }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: #fff;
        border-radius: 3px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform:translate(-50%, -50%);

        .avatar_box {
            height: 130px;
            width: 130px;
            border-radius: 1px solid #eee;
            border-radius: 50%;
            padding: 10px;
            box-shadow: 0 0 10px #ddd;
            position: absolute;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
                background-color: #eee;
            }
        }
    }
    .btns {
        display: flex;
        justify-content: flex-end;
    }

    .login_form {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 0 10px;
        box-sizing: border-box;
    }
</style>
