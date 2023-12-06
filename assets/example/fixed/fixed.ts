import { _decorator, Component, Node, Prefab, director } from 'cc';
import { ScrollAdapter, Holder, IElement, Layer, View } from '../../adapter';
import { fixed_item } from './fixed_item';
const { ccclass, property } = _decorator;
export interface IFixedModel {
    name: any
    fixed: boolean
}
@ccclass('fixed')
export class fixed extends ScrollAdapter<IFixedModel> {
    @property(Node) fixedPrefab: Node = null
    @property(Node) normalPrefab: Node = null
    public getPrefab(data: IFixedModel): Node | Prefab {
        if (data.fixed) {
            return this.fixedPrefab
        }
        return this.normalPrefab
    }
    public getView(): View<IFixedModel, ScrollAdapter<IFixedModel>> {
        return new MyView(this)
    }
    public getHolder(node: Node, code: string): Holder<IFixedModel, ScrollAdapter<IFixedModel>> {
        return new MyHolder(node, code, this)
    }
    public initElement(element: IElement, data: IFixedModel): void {
        element.fixed = data.fixed
        // element.wrapBeforeMode = WrapMode.Auto
        if (element.fixed) {
            element.layer = Layer.Medium
            // element.fixedOffset = 50
            // element.fixedSpacing = 50
        }
    }
    home() {
        director.loadScene("home")
    }
    scrollToHeader() {
        this.scrollManager.scrollToPercentage(1, 0)
    }
    scrollToFooter() {
        this.scrollManager.scrollToPercentage(1, 1)
    }
    start() {
        var list: IFixedModel[] = []
        for (let i = 0; i < 1000; i++) {
            var data: IFixedModel = {
                name: i,
                fixed: i % 10 == 0
            }
            list.push(data)
        }
        this.modelManager.insert(list)
    }
}

class MyView extends View<IFixedModel> {

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class MyHolder extends Holder<IFixedModel>{
    private _item: fixed_item = null
    protected onCreated(): void {
        this._item = this.node.getComponent(fixed_item)
    }
    protected onVisible(): void {
        this._item.show(this)
    }
    protected onDisable(): void {
        this._item.hide()
    }

}
