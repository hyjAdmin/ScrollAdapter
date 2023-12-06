import { _decorator, Component, Node, Prefab, director } from 'cc';
import { Holder, IElement, ScrollAdapter, View, WrapMode } from '../../adapter';
import { edit_item } from './edit_item';
const { ccclass, property } = _decorator;
export interface IEditModel {
    name: any
    anim?: boolean
}
@ccclass('edit')
export class edit extends ScrollAdapter<IEditModel> {
    @property(Node) prefab: Node = null
    public getPrefab(data: IEditModel): Node | Prefab {
        return this.prefab
    }
    public getView(): View<IEditModel, ScrollAdapter<IEditModel>> {
        return new MyView(this)
    }
    public getHolder(node: Node, code: string): Holder<IEditModel, ScrollAdapter<IEditModel>> {
        return new MyHolder(node, code, this)
    }
    public initElement(element: IElement, data: IEditModel): void {
        element.wrapBeforeMode = WrapMode.Auto
    }
    start() {
        var list: IEditModel[] = []
        for (let i = 0; i < 50; i++) {
            list.push({
                name: i
            })
        }
        this.modelManager.insert(list)
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
    insert() {
        this.modelManager.insert({
            name: this.modelManager.length,
            anim: true
        }, 0)
    }
    remove() {
        this.modelManager.remove(6, 1)
    }
    move() {
        this.modelManager.move(this.modelManager.length - 1, 1, 0)
    }
    clear() {
        this.modelManager.clear()
    }
}
class MyView extends View<IEditModel>{

    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}
class MyHolder extends Holder<IEditModel>{
    private _item: edit_item = null
    protected onCreated(): void {
        this._item = this.node.getComponent(edit_item)
    }
    protected onVisible(): void {
        this._item.show(this)
    }
    protected onDisable(): void {
        this._item.hide()
    }
}
