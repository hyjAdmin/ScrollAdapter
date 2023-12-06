import { _decorator, Component, Node, Label } from 'cc';
import { Holder, Helper } from '../../adapter';
import { IFixedModel } from './fixed';
const { ccclass, property } = _decorator;

@ccclass('fixed_item')
export class fixed_item extends Component {
    @property(Label) label: Label = null
    private _holder: Holder<IFixedModel>

    show(holder: Holder) {
        this._holder = holder
        this.label.string = this._holder.data.name
    }

    hide() {

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

