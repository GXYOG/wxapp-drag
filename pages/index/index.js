const app = getApp();
Page({
  data: {
    arr: [
      {
        id: 1,
        name: '1号'
      },
      {
        id: 2,
        name: '2号'
      },
      {
        id: 3,
        name: '3号'
      },
      {
        id: 4,
        name: '4号'
      },
      {
        id: 5,
        name: '5号'
      },
      {
        id: 6,
        name: '6号'
      },
    ],
    boxWeight: 750, //容器宽度,100%为750，单位rpx
    boxHeight: 0, //容器高度
    height: 352, //滑块总高度,即滑块本身加上边距的高度
    selectId: 0, //当前选中滑块的id
    col: 3, //滑块列数
  },
  onLoad: function (options) {

  },

  onShow() {
    let {arr,height,boxWeight,col,boxHeight} = this.data;
    arr.forEach((item,i) => {
      item.x = (i % col) * Math.trunc(boxWeight / col)  //区域左上角横坐标
      item.y = Math.trunc(i / col) * height //区域左上角纵坐标
      item.index = i;
    })
    if (Math.trunc(arr.length % col)){
      boxHeight = (Math.trunc(arr.length / col) + 1) * height
    }else{
      boxHeight = Math.trunc(arr.length / col) * height
    }
    this.setData({
      healthItem: arr,
      layerItem: arr,
      boxHeight,
    })
  },


  /**
   * 点击到滑块时切换隐藏显示
   */
  unlockItem(e){
    this.setData({
      selectId: e.currentTarget.dataset.id
    })
  },

  /**
   * 拖动滑块
   */
  touchMove(e){
    const s = this;
    let {boxWeight,height,layerItem,col} = s.data
    let weight = Math.trunc(boxWeight / col); //每块区域的宽度
    if (e.detail.source === 'touch'){
      let arr = [...layerItem];
      let id = e.currentTarget.dataset.id;
      let centerX = (e.detail.x * 2) + (weight / col) //当前选中滑块的中心的x坐标
      let centerY = (e.detail.y * 2) + (height / col) //当前选中滑块的中心的y坐标
      let key = 0; //滑块滑动时的位置
      let index = 0; //滑块滑动前的位置

      //通过id判断当前滑块的index
      layerItem.forEach(item => {
        if (item.id === id){
          index = item.index
        }
      })

      //根据当前滑块位置确认当前所处在哪个区域
      for (let i = 0; i < arr.length + 1; i++){
        let x1 = (i % col) * (boxWeight / col) //第n个区域的左上角和左下角x坐标
        let x2 = (i % col + 1) * (boxWeight / col) //第n个区域的右上角和右下角x坐标
        let y1 = Math.trunc(i / col) * height //第n个区域的左上角和右上角y坐标
        let y2 = Math.trunc(i / col + 1) * height //第n个区域的左下角和右下角y坐标
        //判断当前滑块所属区域
        if (centerX > x1 && centerX < x2 && centerY > y1 && centerY < y2){
          key = i
        }
      }
      //当key值大于数组长度时，即数组长度为奇数，滑块位于容器右下方无滑块的位置，滑块实际的key值为数组长度减一
      if (key >= arr.length - 1){
        key = arr.length - 1
      }

      //滑动时位置与滑动前不同时
      if (index != key){
        //计算数组中其他数据变化后的index
        arr.forEach((item,i) => {
          if (item.id != id){
            //index前进到key位置
            if (index > key){
              if (item.index >= key && item.index < index){
                item.index = item.index + 1
              }
            }
            //index后退到key位置
            if (index < key){
              if (item.index > index && item.index <= key){
                item.index = item.index - 1
              }
            }
          }else{
            item.index = key
          }
        })

        //根据数据变化后的index计算改变顺序后的实际位置
        arr.forEach((item,i) => {
          item.x = (item.index % col) * (boxWeight / col)
          item.y = Math.trunc(item.index / col) * height
        })

        s.setData({
          layerItem: arr,
          key,index
        })
      }
    }
  },

  /**
   * 停止拖动，两数组同步
   */
  touchend(e){
    let {layerItem} = this.data;
    this.setData({
      healthItem: layerItem,
    })
  },

});