import { _decorator, Component, Node, Label } from 'cc';
import { Holder, Helper } from '../../adapter';
const { ccclass, property } = _decorator;

@ccclass('card_item')
export class card_item extends Component {
    @property(Label) label: Label = null
    private _holder: Holder
    show(holder: Holder) {
        this._holder = holder
        this.label.string = holder.data.name
        this.node.setScale(0.3, 0.3)
    }
    hide() {
    }
    click() {
        this._holder.adapter.scrollManager.scrollToGroupIndex(1, this._holder.view.index)
    }
    update() {
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
        // var size = this._holder.transform.contentSize
        // size[this._holder.adapter.mainAxis]=350 * percentage
        // this._holder.transform.setContentSize(350 * percentage, 450)
    }
}

