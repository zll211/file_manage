import Stomp from 'stompjs';
import {STOMP_HEADERS, STOMP_SERVICE} from "../config/utils";
import {mapState} from "vuex";

export default {
  name: 'stomp',
  data() {
    return {
      // client: Stomp.over(new SockJS(STOMP_SERVICE)),
      client: null,
      subscriptions: [],
      clearTimeId: null,
      count: 0, // 记录重连次数
    }
  },
  computed: {
    ...mapState(['user']),
  },
  created() {
    this.$store.commit('stomp/setScanSliceProgress', null);
    this.$store.commit('stomp/setMoveFileProgress', null);
  },
  methods: {
    onConnected(frame) {
      this.$notify.success({
        title: '成功',
        message: 'stomp连接成功',
      });
      this.count = 0;
      this.$store.commit('stomp/setConnected', true);
      // const moveQueue = `/topic/file_${this.user.username}_move_file`;
      const scanQueue = `/topic/file_${this.user.username}_scan_slice`;
      const relateQueue = `/topic/file_${this.user.username}_relate_json`;
      // this.subscribeProgress(moveQueue, 'move_file');
      this.subscribeProgress(scanQueue, 'scan_slice');
      this.subscribeProgress(relateQueue, 'relate_json');
    },
    onFailed(frame) {
      this.$store.commit('stomp/setConnected', false);
      this.delayedTrigger(() => this.reconnection(), 5000);
    },
    disconnect(msg) {
      this.client.disconnect(() => {
        if (msg) {
          this.$message.error(msg);
        }
      })
    },
    connect() {
      /*const headers = {
        login: 'hzzt',
        passcode: 'hzztrbq@2018',
      };*/
      this.client = Stomp.client(STOMP_SERVICE);
      this.client.connect(STOMP_HEADERS, this.onConnected, this.onFailed);
      this.$store.commit('stomp/setClient', this.client);
    },
    reconnection() {
      if (this.count === 0) {
        this.$notify.info({
          title: '消息',
          message: 'stomp连接失败，正在尝试重连中...',
        });
        this.connect();
        this.count++;
      } else if (this.count < 5) {
        this.$notify.info({
          title: '消息',
          message: `重连stomp失败，正在进行第${this.count + 1}次重连`,
        });
        this.connect();
        this.count++;
      } else if (this.count >= 5) {
        this.$notify.error({
          title: '失败',
          message: `stomp连接失败，无法进行通讯`,
        });
      }
    },
    subscribeProgress(url, type) {
      this.subscriptions.push(this.client.subscribe(url, (msg) => {
        console.log(msg.body);
        const body = JSON.parse(msg.body);
        if (type === 'move_file') {
          this.$store.commit('stomp/setMoveFileProgress', body);
          // this.delayedTrigger(() => this.$root.$emit('refresh-list'), 2000);
        }
        if (type === 'scan_slice') {
          this.$store.commit('stomp/setScanSliceProgress', body);
          this.delayedTrigger(() => this.$root.$emit('refresh-list'), 2000);
        }
        if (type === 'relate_json') {
          this.$store.commit('stomp/setRelateJSONProgress', body);
          this.delayedTrigger(() => this.$root.$emit('refresh-slice-list'), 2000);
        }
      }))
    },
    delayedTrigger(callback, time = 1000) {
      if (this.clearTimeId) {
        clearTimeout(this.clearTimeId);
        this.clearTimeId = null;
      } else if (!this.clearTimeId) {
        callback();
      }
      this.clearTimeId = setTimeout(callback, time);
    }
  },
  beforeDestroy() {
    while (this.subscriptions.length > 0) {
      const sub = this.subscriptions.shift();
      sub.unsubscribe();
    }
    this.$store.commit('stomp/setMoveFileProgress', null);
    this.$store.commit('stomp/setScanSliceProgress', null);
    this.disconnect();
  }
}
