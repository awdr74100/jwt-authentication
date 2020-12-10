<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <button @click.prevent="signIn">登入</button>
    <button @click.prevent="check">驗證</button>
    <button @click.prevent="signout">登出</button>
    <button @click.prevent="refresh">換發</button>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    async signIn() {
      try {
        const { data } = await this.axios.post('http://localhost:3000/user/signin', {
          name: 'YiRu',
        });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
      } catch (error) {
        console.log(error);
      }
    },
    async check() {
      try {
        const url = 'http://localhost:3000/user/check';
        const { data } = await this.axios.post(url, { age: 17 });
        console.log('component', data);
      } catch (error) {
        console.dir(error);
      }
    },
    async signout() {
      const { data } = await this.axios.post('http://localhost:3000/user/signout', {
        token: localStorage.getItem('refreshToken'),
      });
      console.log(data);
    },
    // async refresh() {
    //   const { data } = await this.axios.post('http://localhost:3000/user/token', {
    //     token: localStorage.getItem('refreshToken'),
    //   });
    //   localStorage.setItem('accessToken', data.accessToken);
    //   console.log(data);
    // },
  },
};
</script>
