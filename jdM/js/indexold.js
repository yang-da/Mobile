window.onload = function () {
    /*1. 顶部搜索*/
    search();
    /*2. 轮播图*/
    banner();
    /*3. 倒计时*/
    downTime();
};
var search = function () {
    /*需求*/
    /*1. 默认顶部位置透明*/
    /*2. 当页面滚动的时候  滚动的越多透明度越大  最大0.85*/
    /*3. 当超过轮播图的位置的时候  透明度不变*/
    var jdHeaderBox = document.querySelector('.jd_header_box');
    var jdBanner = document.querySelector('.jd_banner');
    var height = jdBanner.offsetHeight;
    window.onscroll = function () {
        /*获取滚动的距离  卷曲的距离*/
        var scrollTop = window.pageYOffset || document.body.scrollTop || document.documentElement.scrollTop;
        /*获取轮播图高度*/
        var opacity = 0;
        if (scrollTop < height) {
            /*范围内 递增的透明度*/
            opacity = scrollTop / height * 0.85;
        } else {
            /*不变 0.85*/
            opacity = 0.85;
        }
        /*设置*/
        jdHeaderBox.style.background = 'rgba(216,80,92,' + opacity + ')';
    }
};
var banner = function () {
    /*需求*/
    /*1. 自动轮播 无缝的  过渡+位移=动画 */
    /*2. 点对应当前图片  根据索引改点的NOW样式*/
    /*3. 滑动功能  滑动过程中轮播图停止  使用touch事件更改触摸的容器位置 */
    /*4. 滑动结束 滑动的距离 不超过三分之一  吸附回去 */
    /*5. 滑动结束 滑动的距离 超过三分之一  图片切换  上一张  下一张 */
    /*6. 附加功能 滑动的速度超过（手感的比较快的速度）切换图片  上一张  下一张*/

    /*获取操作的dom元素*/
    var jdBanner = document.querySelector('.jd_banner');
    /*获取当前容器的宽度  位移*/
    var width = jdBanner.offsetWidth;
    /*图片容器*/
    var imageBox = jdBanner.querySelector('ul:first-child');
    /*点容器*/
    var pointBox = jdBanner.querySelector('ul:last-child');
    /*所有的点*/
    var lis = pointBox.querySelectorAll('li');

    /*1. 自动轮播 无缝的  过渡+位移=动画 */
    var index = 1;
    var timer = setInterval(function () {
        index++;
        /*动画切换*/
        /*过渡*/
        imageBox.style.transition = 'all 0.3s';
        imageBox.style.webkitTransition = 'all 0.3s';
        /*位移*/
        imageBox.style.transform = 'translateX(' + (-index * width) + 'px)';
        imageBox.style.webkitTransform = 'translateX(' + (-index * width) + 'px)';
    }, 1000);
    /*当最后一张图片动画切换完成  瞬间定位当第二张 */
    imageBox.addEventListener('transitionend',function () {
        /*索引为9且动执行完成*/
        if(index >= 9){
            /*无缝的滚动*/
            /*瞬间移动索引1的图片*/
            index = 1;
            /*去过渡*/
            imageBox.style.transition = 'none';
            imageBox.style.webkitTransition = 'none';
            /*位移*/
            imageBox.style.transform = 'translateX(' + (-index * width) + 'px)';
            imageBox.style.webkitTransform = 'translateX(' + (-index * width) + 'px)';
        }else if(index <= 0){
            /*无缝的滑动*/
            index = 8;
            /*去过渡*/
            imageBox.style.transition = 'none';
            imageBox.style.webkitTransition = 'none';
            /*位移*/
            imageBox.style.transform = 'translateX(' + (-index * width) + 'px)';
            imageBox.style.webkitTransform = 'translateX(' + (-index * width) + 'px)';
        }
    });

};
var downTime = function () {

};