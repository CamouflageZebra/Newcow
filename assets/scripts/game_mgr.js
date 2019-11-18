// 定义了一个组件类
cc.Class({
    // cc.Component 组件类的基类;
    extends: cc.Component,

    properties: {
        rope: {
            type: cc.Node,
            default: null,
        },

        cow_root: {
            type: cc.Node,
            default: null,
        },

        cow_prefab: {
            type: cc.Prefab,
            default: null,
        },

        rope_imgs: {
            type: cc.SpriteFrame,
            default: [],
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    // 组件实例.start: 开始运行之前调用;
    start () {
        // this---> 当前组件实例, this.node --> 当前组件实例所在的节点;
        this.rope.x = 0;
        this.rope.y = -600;
        this.is_throwing = false;
        this.rope_sp = this.rope.getComponent(cc.Sprite);
        this.rope_sp.spriteFrame = this.rope_imgs[0];
        
        this.gen_one_cow();
    },

    gen_one_cow() {
        var cow = cc.instantiate(this.cow_prefab);
        this.cow_root.addChild(cow);
        cow.x = 595;
        cow.y = -99;

        var time = 3 + Math.random() * 2;
        this.scheduleOnce(this.gen_one_cow.bind(this), time);
    },
    // 每次刷新的时候
    // 组件实例.update,  dt: 距离上一次刷新过去的时间间隔;
    // 编写变化逻辑的;
    update (dt) {

    },

    hit_test() {
        for(var i = 0; i < this.cow_root.childrenCount; i ++) {
            var cow = this.cow_root.children[i];
            if (cow.x >= 73 && cow.x <= 152) {
                return cow;
            }
        }

        return null;
    },

    on_throw_click() {

        if (this.is_throwing === true) {
            return;
        }

        this.rope_sp.spriteFrame = this.rope_imgs[0];

        this.is_throwing = true;
        // 移动Action, [m1, m2]  --> 队列容器把他们装起来;
        var m1 = cc.moveTo(0.5, cc.v2(0, 33));
        var m2 = cc.moveTo(0.5, cc.v2(0, -600));
        var end_func = cc.callFunc(function() {
            this.is_throwing = false;
        }.bind(this), this);

        var mid_func = cc.callFunc(function() {
            var cow = this.hit_test();
            if (cow) { // 
                var cow_type = cow.getComponent("cow").c_type; // 1, 2, 3
                this.rope_sp.spriteFrame = this.rope_imgs[cow_type];
                cow.removeFromParent();

                this.rope.y = 114;
            }

        }.bind(this), this);

        var seq = cc.sequence([m1, mid_func, m2, end_func]);
        this.rope.runAction(seq);
    },
});
