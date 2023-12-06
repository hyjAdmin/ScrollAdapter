
import { _decorator, Component, Node, Prefab, Camera, Sprite, RenderTexture, UITransform, SpriteFrame, geometry, director } from 'cc';
import { Holder, IElement, ScrollAdapter, View } from '../../adapter';
import { TimeItem } from './time_item';
const { ccclass, property } = _decorator;
export interface ITimeModel {
    name: any
    value: number
    type: number
}
@ccclass('Time')
export class Time extends ScrollAdapter {
    @property(Node) prefab: Node = null
    @property type: number = 0
    public getPrefab(data: any): Node | Prefab {
        return this.prefab
    }
    public getView(): View<any, ScrollAdapter<any>> {
        return new MyView(this)
    }
    public getHolder(node: Node, code: string): Holder<any, ScrollAdapter<any>> {
        return new MyHolder(node, code, this)
    }
    public initElement(element: IElement, data: any) {
    }
    protected onLoad(): void {
        var list: ITimeModel[] = []

        if (this.type == 0) {
            var year = 1850
            for (let i = 0; i < 2000; i++) {
                list.push({
                    value: year + i,
                    name: "年",
                    type: this.type
                })
            }
        } else if (this.type == 1) {
            for (let i = 0; i < 12; i++) {
                list.push({
                    value: i + 1,
                    name: `月`,
                    type: this.type
                })
            }
        } else if (this.type == 2) {
            for (let i = 0; i < 31; i++) {
                list.push({
                    value: i + 1,
                    name: `日`,
                    type: this.type
                })
            }
        }
        this.modelManager.insert(list)
    }
    scrollTo(duration: number, value: any) {
        var index = this.modelManager.modelList.findIndex(item => item.data.value == value)
        this.scrollManager.scrollToGroupIndex(duration, index)
    }
}
class MyView extends View<ITimeModel>{
    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class MyHolder extends Holder<ITimeModel>{
    private _item: TimeItem
    protected onCreated(): void {
        this._item = this.node.getComponent(TimeItem)
    }
    protected onVisible(): void {
        this._item.show(this)
    }
    protected onDisable(): void {
        this._item.hide()
    }

}