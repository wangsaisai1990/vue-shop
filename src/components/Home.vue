<template>
    <el-container class="home-container">
        <el-header>
            <div>
                <img src="../assets/me.png" alt="">
                <span class="red">欢迎来到MY管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出</el-button>
        </el-header>
        <el-container>
            <el-aside :width=" isCollapse ? '64px' : '200px'">
                <div class="toggle-button" @click="toggleCollapse">|||</div>
                <el-menu background-color="#333744" text-color="#fff" unique-opened :collapse="isCollapse"
                    :collapse-transition="false" router :default-active="activePath">
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <template slot="title">
                        <i :class="iconsObj[item.id]"></i>
                        <span>{{ item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/' + subItem.path" v-for="subItem in item.children"
                            :key="subItem.id" @click="saveNavState('/' + subItem.path)">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{ subItem.authName }}</span>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    data() {
        return {
            menulist: [],
            iconsObj: {
                '125': 'iconfont icon-user',
                '103': 'iconfont icon-tijikongjian',
                '101': 'iconfont icon-shangpin',
                '102': 'iconfont icon-danju',
                '145': 'iconfont icon-baobiao'
            },
            // 是否折叠
            isCollapse: false,
            // 被激活得链接
            activePath: true
        }
    },
    created() {
        this.getMenuList()
        //
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        logout() {
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        async getMenuList() {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.menulist = res.data
            console.log(res)
        },
        toggleCollapse() {
            this.isCollapse = !this.isCollapse;
        },
        saveNavState(activepath) {
            window.sessionStorage.setItem('activePath', activepath)
            this.activePath = activepath
        }
    }
}
</script>
<style lang="less" scoped>
    .el-header {
        background-color: #373d41;
        display: flex;
        justify-content: space-between;
        padding-left: 20;
        align-items: center;
        > div {
            display: flex;
            align-items: center;
            span {
                margin-left: 15px;
            }
        }
    }

    .red {
        color:#fff
    }

    .el-aside {
        background-color: #333744;
        .el-menu {
            border-right: none;
        }
    }

    .el-main {
        background-color: #eaedf1;
    }

    .home-container{
        height: 100%;
    }
    .el-submenu__title {
        span {
            margin-left: 10px;
        }
    }
    
    .toggle-button {
        background-color: #4a5064;
        font-size: 10px;
        line-height: 30px;
        color: #fff;
        text-align: center;
        letter-spacing: 0.5em;
    }
</style>
