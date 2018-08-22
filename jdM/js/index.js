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

    var addTransition = function () {
        imageBox.style.transition = 'all 0.3s';
        imageBox.style.webkitTransition = 'all 0.3s';
    };
    var removeTransition = function () {
        imageBox.style.transition = 'none';
        imageBox.style.webkitTransition = 'none';
    };
    var setTranslateX = function (translateX) {
        imageBox.style.transform = 'translateX(' + translateX + 'px)';
        imageBox.style.webkitTransform = 'translateX(' + translateX + 'px)';
    };

    /*1. 自动轮播 无缝的  过渡+位移=动画 */
    var index = 1;
    var timer = setInterval(function () {
        index++;
        /*动画切换*/
        /*过渡*/
        addTransition();
        /*位移*/
        setTranslateX(-index * width);
    }, 4000);
    /*当最后一张图片动画切换完成  瞬间定位当第二张 */
    imageBox.addEventListener('transitionend', function () {
        /*索引为9且动执行完成*/
        if (index >= 9) {
            /*无缝的滚动*/
            /*瞬间移动索引1的图片*/
            index = 1;
            /*去过渡*/
            removeTransition();
            /*位移*/
            setTranslateX(-index * width);
        } else if (index <= 0) {
            /*无缝的滑动*/
            index = 8;
            /*去过渡*/
            removeTransition();
            /*位移*/
            setTranslateX(-index * width);
        }
        /*2. 点对应当前图片  根据索引改点的NOW样式*/
        /*当前的索引取值范围是多少  1-8 对应LI的所有 0-7 */
        setPoint();
    });

    var setPoint = function () {
        /*index 1-8 */
        /*去之前的样式*/
        pointBox.querySelector('li.now').classList.remove('now');
        /*给当前的加样式   */
        lis[index - 1].classList.add('now');
    }

    /*3. 滑动功能  滑动过程中轮播图停止  使用touch事件更改触摸的容器位置 */
    var startX = 0; //记录起始的X坐标
    var distanceX = 0;//记录滑动的距离改变
    var startTime = 0;//开始滑动的时间
    var isMove = false; // 严谨 的一个判断是否滑动的参数
    imageBox.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startTime = Date.now();//当前时间  时间戳   new Date().getTime();
        /*清除定时器*/
        clearInterval(timer);
    });
    imageBox.addEventListener('touchmove', function (e) {
        /*在移动端有浏览器默认事件  滑动边框部分 回退前进历史的行为*/
        /*在移动端有浏览器默认事件  上下滚动*/
        e.preventDefault();
        var moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        /*位置距离的改变*/
        //console.log(distanceX);
        /*将要去定位的位置 = 当前的位移 + 距离的改变 */
        var translateX = -index * width + distanceX;
        /*去改变图片容器的位置 不能有动画*/
        removeTransition();
        setTranslateX(translateX);
        isMove = true;
    });
    imageBox.addEventListener('touchend', function (e) {
        /*一定滑动过*/
        if (isMove) {
            var t = Date.now() - startTime; //毫秒
            var d = Math.abs(distanceX);
            var speed = d / t;//怎么求这个速度   移动的距离/滑动的时间 = 速度
            /*经过测试  体感速度  0.5 px/ms 比较快*/
            //console.log(speed);
            if (speed > 0.3) {
                /*6. 附加功能 滑动的速度超过（手感的比较快的速度）切换图片  上一张  下一张*/
                /*右滑  上一张*/
                if (distanceX > 0) {
                    index--;
                }
                /*左滑  下一张*/
                else {
                    index++;
                }
                /*切换动画*/
                addTransition();
                setTranslateX(-index * width);
            } else {
                /*4. 滑动结束 滑动的距离 不超过三分之一  吸附回去 */
                if (Math.abs(distanceX) < width / 3) {
                    /*吸附效果 有动画  回到原来的位置*/
                    addTransition();
                    setTranslateX(-index * width);
                }
                /*5. 滑动结束 滑动的距离 超过三分之一  图片切换  上一张  下一张 */
                else {
                    /*右滑  上一张*/
                    if (distanceX > 0) {
                        index--;
                    }
                    /*左滑  下一张*/
                    else {
                        index++;
                    }
                    /*切换动画*/
                    addTransition();
                    setTranslateX(-index * width);
                }
            }
        }

        /*1. 定时器重新开启*/
        clearInterval(timer); //防止多次绑定定时器
        timer = setInterval(function () {
            index++;
            /*动画切换*/
            /*过渡*/
            addTransition();
            /*位移*/
            setTranslateX(-index * width);
        }, 4000);
        /*2. 如果没有滑动过*/
        isMove = false;
        startX = 0;
        startTime = 0;
        distanceX = 0;
        /*重置参数*/
    });
};
var downTime = function () {
    /*需求*/
    /*1. 模拟需要倒计时  4小时*/
    /*2. 每一秒去更新 黑色盒子*/
    var spanList = document.querySelectorAll('.sk_time span');
    var time = 4 ;
    var timer = setInterval(function () {
        time--;
        /*格式*/
        var h = Math.floor(time / 3600);
        var m = Math.floor(time % 3600 / 60);
        var s = Math.floor(time % 60);

        spanList[0].innerHTML = Math.floor(h / 10);
        spanList[1].innerHTML = h % 10;

        spanList[3].innerHTML = Math.floor(m / 10);
        spanList[4].innerHTML = m % 10;

        spanList[6].innerHTML = Math.floor(s / 10);
        spanList[7].innerHTML = s % 10;

        if(time <= 0){
            clearInterval(timer);
        }

    }, 1000);
};