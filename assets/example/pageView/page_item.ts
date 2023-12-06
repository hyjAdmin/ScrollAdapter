import { _decorator, Component, Node, Label } from 'cc';
import { Helper, Holder } from '../../adapter';
const { ccclass, property } = _decorator;
@ccclass('page_item')
export class page_item extends Component {
    @property(Label) label: Label = null
    @property isScale: boolean = false
    private _holder: Holder
    show(holder: Holder) {
        this._holder = holder
        this.label.string = this._holder.data.name
    }
    hide() {

    }
    click() {
        if (this.isScale) {
            this._holder.adapter.scrollManager.scrollToGroupIndex(1, this._holder.view.index)
        }
    }
    update() {
        if (!this.isScale) return
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

