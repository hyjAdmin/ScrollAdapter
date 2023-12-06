import { _decorator, Component, Node, Label, Prefab } from 'cc';
import { Holder, IElement, ScrollAdapter, View, WrapMode } from '../../adapter';
import { item_page } from './item_page';
import { IPageViewModel } from './pageView';
import { page_item } from './page_item';
const { ccclass, property } = _decorator;
@ccclass('pageView_item')
export class pageView_item extends ScrollAdapter<IPageViewModel> {
    @property(Label) label: Label = null
    @property(Prefab) prefab1: Prefab = null
    @property(Node) prefab2: Node = null
    private _holder: Holder<IPageViewModel>
    public getPrefab(data: IPageViewModel): Node | Prefab {
        if (data.type == 0) {
            return this.prefab1
        }
        return this.prefab2
    }
    public getView(): View<any> {
        return new MyView(this)
    }
    public getHolder(node: Node, code: string): Holder<any> {
        return new MyHolder(node, code, this)
    }
    public initElement(element: IElement, data: IPageViewModel): void {
        if (data.wrapAfter) {
            element.wrapAfterMode = data.wrapAfter
            element.wrapBeforeMode = data.wrapBefore
        }
    }
    show(holder: Holder) {
        this._holder = holder
        this.label.string = this._holder.data.name
        var list = []
        for (let i = 0; i < 10; i++) {
            var data: IPageViewModel = { name: i + "", type: i % 2 }
            if (this._holder.data.type == 0) {
                data.wrapAfter = WrapMode.Nowrap
                data.wrapBefore = i % 2 == 1 ? WrapMode.Auto : WrapMode.Wrap
            }
            list.push(data)
        }
        this.modelManager.insert(list)

    }
    hide() {
        this.modelManager.clear()
    }
}
class MyView extends View<IPageViewModel>{

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class MyHolder extends Holder<IPageViewModel>{
    private _item: item_page | page_item = null
    protected onCreated(): void {
    }
    protected onVisible(): void {
        if (this.data.type != 0) {
            this._item = this.node.getComponent(item_page)
        } else {
            this._item = this.node.getComponent(page_item)
        }
        this._item.show(this)
    }
    protected onDisable(): void {
        this._item.hide()
    }

}

