
import { _decorator, Component, Node, Label, UIOpacity, v3 } from 'cc';
import { Holder } from '../../adapter';
import { ITimeModel } from './time';
const { ccclass, property } = _decorator;
@ccclass('TimeItem')
export class TimeItem extends Component {
    @property(Label) label: Label = null
    @property(UIOpacity) opacity: UIOpacity = null
    private _holder: Holder<ITimeModel>
    show(holder: Holder) {
        this._holder = holder
        this.label.string = `${this._holder.data.value} ${this._holder.data.name}`
    }
    hide() {
    }
    click() {
        this._holder.adapter.scrollManager.scrollToGroupIndex(0.5, this._holder.view.index)
    }
    lateUpdate(deltaTime: number) {
        if (!this._holder || !this._holder.model) return
        var world = this._holder.adapter.scrollManager.content.convertToWorldSpaceAR(this.node.position)
        var local = this._holder.adapter.scrollManager.view.convertToNodeSpaceAR(world)
        var container = this._holder.adapter.centerManager.getContainerOffset()
        var offset = local[this._holder.adapter.mainAxis] + container
        offset = Math.abs(offset)
        var percentage = offset / (this._holder.adapter.mainAxisSize * 0.85)
        percentage = 1 - percentage
        var scale = this.node.getScale()
        scale[this._holder.adapter.mainAxis] = percentage
        this.node.setScale(scale)

        var percentage2 = (1 - offset / (this._holder.adapter.mainAxisSize * 0.5))
        this.opacity.opacity = percentage2 * 255
        var angle = 360 / 10
        var currentAngle = angle * (1 - percentage)
        var x = offset * 0.1 - offset * 0.1 * percentage * Math.cos((currentAngle * Math.PI) / 180)
        if (this._holder.data.type == 0) {
            this.label.node.setPosition(v3(x, 0))
        } else if (this._holder.data.type == 2) {
            this.label.node.setPosition(v3(-x, 0))
        }
    }
}
