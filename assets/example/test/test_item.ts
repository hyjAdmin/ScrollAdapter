
import { _decorator, Component, Node, Label } from 'cc';
import { Helper, Holder, HolderEvent } from '../../adapter';
const { ccclass, property } = _decorator;
@ccclass('TestItem')
export class TestItem extends Component {
    @property(Label) label: Label = null
    private _holder: Holder = null
    onLoad() {
        this.node.on(HolderEvent.CREATED, this.onCreated, this)
        this.node.on(HolderEvent.VISIBLE, this.onVisible, this)
        this.node.on(HolderEvent.DISABLE, this.onDisabled, this)
    }
    private onCreated() {
        console.log("我收到了创建")
    }
    private onVisible(holder: Holder) {
        console.log("我收到了显示", holder.data)
        this._holder = holder
        this.label.string = holder.data.name
    }
    private onDisabled(holder: Holder) {
        console.log("我收到了隐藏", holder)
    }
    click() {
        if (this._holder.transform.height == 350) {
            this._holder.transform.height = 200
        } else {
            this._holder.transform.height = 350
        }
    }
    update() {
        return
        if (this._holder.adapter.scrollManager.test) return
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
        scale[this._holder.adapter.crossAxis] = 1
        this.node.setScale(scale)
    }
}