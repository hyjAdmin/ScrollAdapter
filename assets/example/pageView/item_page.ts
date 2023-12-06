import { _decorator, Component, Node, Prefab, Label } from 'cc';
import { Holder, IElement, ScrollAdapter, View } from '../../adapter';
import { page_item } from './page_item';
const { ccclass, property } = _decorator;

@ccclass('item_page')
export class item_page extends ScrollAdapter {
    @property(Label) label: Label = null
    @property(Node) prefab: Node = null
    public getPrefab(data: any): Node | Prefab {
        return this.prefab
    }
    public getView(): View<any, ScrollAdapter<any>> {
        return new MyView(this)
    }
    public getHolder(node: Node, code: string): Holder<any, ScrollAdapter<any>> {
        return new MyHolder(node, code, this)
    }
    public initElement(element: IElement, data: any): void {
    }
    private _holder: Holder = null
    show(holder: Holder) {
        this._holder = holder
        this.label.string = this._holder.data.name
        var list = []
        for (let i = 0; i < 10; i++) {
            list.push({ name: i })
        }
        this.modelManager.insert(list)
    }
    hide() {
        this.modelManager.clear()
    }
}

class MyView extends View {

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }

}
class MyHolder extends Holder {
    private _item: page_item = null
    protected onCreated(): void {
        this._item = this.node.getComponent(page_item)
    }
    protected onVisible(): void {
        this._item.show(this)
    }
    protected onDisable(): void {
        this._item.hide()
    }

}

