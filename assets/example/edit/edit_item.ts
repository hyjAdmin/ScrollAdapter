import { _decorator, Component, Node, Label, UITransform, Tween, v3, v2, EventTouch, Vec3, UIOpacity, Sprite, Color } from 'cc';
import { ADAPTER, Helper, Holder, Layer, WrapMode } from '../../adapter';
import { IEditModel } from './edit';
const { ccclass, property } = _decorator;

@ccclass('edit_item')
export class edit_item extends Component {
    @property(Label) label: Label = null
    private _holder: Holder<IEditModel> = null
    private _tween: Tween<Node>


    private _onTouchMove(event: EventTouch) {
        console.log("移动了我")
        var position = this.node.getPosition()
        position.add3f(event.getUIDelta().x, event.getUIDelta().y, 0)
        this.node.setPosition(position)
    }



    show(holder: Holder<IEditModel>) {
        this._holder = holder
        this.label.string = this._holder.data.name
        if (this._holder.data.anim) {
            this._holder.data.anim = false
            this.node.setScale(0, 1, 1)
            this._tween = new Tween(this.node).to(0.5, {
                scale: v3(1, 1, 1)
            }, { easing: "backOut" }).start()
        }
        this.register()
    }
    hide() {
        if (this._tween) {
            this._tween.stop()
        }
        this.node.setScale(1, 1, 1)
        this._holder.data.anim = false
    }
    updateData() {
        this._holder.data.name = "已更新"
        this._holder.model.update()
    }
    updateWrap() {
        this._holder.element.wrapBeforeMode = WrapMode.Wrap
        // this._holder.element.wrapAfterMode = WrapMode.Wrap
        this._holder.element.update()
    }
    ignoreLayout() {
        // 忽略布局 但保留位置
        this._holder.element.placeholder = true
        this._holder.element.ignoreLayout = !this._holder.element.ignoreLayout
        if (this._holder.element.ignoreLayout) {
            this._holder.element.layer = Layer.Medium
            // this.node.getComponent(Sprite).color = new Color(299, 77, 82, 128)
        } else {
            this._holder.element.layer = Layer.Lowest
            // this.node.getComponent(Sprite).color = new Color(56, 120, 94, 255)
        }
        this._holder.element.update()
        this.register()
    }
    register() {
        this.node.off(Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
        if (this._holder.element.ignoreLayout) {
            this.node.on(Node.EventType.TOUCH_MOVE, this._onTouchMove, this)
            this.node[ADAPTER] = true
        } else {
            this.node[ADAPTER] = false
        }
    }

    update() {
        return
        if (!this._holder || !this._holder.model) return
        var world = this._holder.adapter.scrollManager.content.convertToWorldSpaceAR(this.node.position)
        var local = this._holder.adapter.scrollManager.view.convertToNodeSpaceAR(world)
        var container = this._holder.adapter.centerManager.getContainerOffset()
        var offset = Math.abs(local[this._holder.adapter.mainAxis]) - container
        var percentage = Math.abs(offset) / this._holder.adapter.mainAxisSize
        percentage = 1 - percentage
        percentage = Helper.clamp(percentage, 0.3, 1)
        var scale = this.node.getScale()
        scale[this._holder.adapter.mainAxis] = percentage
        scale[this._holder.adapter.crossAxis] = percentage
        this.node.setScale(scale)
    }

}

