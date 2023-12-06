import { _decorator, Component, Node, Label, } from 'cc';
import { Helper, Holder } from '../../adapter';
const { ccclass, property } = _decorator;
@ccclass('horiznal_scale_card_item')
export class horiznal_scale_card_item extends Component {
    @property(Label) label: Label = null
    start() {

    }
    _holder: Holder
    show(holder: Holder) {
        this._holder = holder
        this.label.string = holder.data.name
    }
    hide() {
        // this._holder.transform.width = 50
        // this.node.setScale(1, 1)
    }

    click() {
        if (this._holder.transform.height == 350) {
            this._holder.transform.height = 200
        } else {
            this._holder.transform.height = 350
        }
        // this._holder.adapter.scrollManager.scrollToGroupIndex(1, this._holder.view.index)
    }
    lateUpdate() {
        // return
        if (!this._holder || !this._holder.model) return
        if (this._holder.view.index == 29 || true) {
            var world = this._holder.adapter.scrollManager.content.convertToWorldSpaceAR(this.node.position)
            var local = this._holder.adapter.scrollManager.view.convertToNodeSpaceAR(world)
            var container = this._holder.adapter.centerManager.getContainerOffset()
            var offset = Math.abs(local[this._holder.adapter.mainAxis]) - container
            var percentage = Math.abs(offset) / this._holder.adapter.mainAxisSize
            percentage = 1 - percentage
            percentage = Helper.clamp(percentage, 0.3, 1)
            var scale = this.node.getScale()
            scale[this._holder.adapter.mainAxis] = percentage
            this.node.setScale(scale)
            // var size = this._holder.transform.contentSize
            // size[this._holder.adapter.mainAxis]=350 * percentage
            // this._holder.transform.setContentSize(350 * percentage, 450)
        }
    }
}