
import { _decorator, Component, Node, Prefab, Camera, Sprite, Tween, tween, game, director } from 'cc';
import { ScrollAdapter, Holder, IElement, View } from '../../adapter';
const { ccclass, property } = _decorator;
export interface ITestModel {
    name: any
    index: number
}
@ccclass('Test')
export class Test extends ScrollAdapter<ITestModel> {
    @property(Node) prefab: Node = null
    public getPrefab(data: ITestModel): Node | Prefab {
        return this.prefab
    }
    protected start(): void {
        var list: ITestModel[] = []
        for (let i = 0; i < 100; i++) {
            list.push({
                name: i,
                index: i
            })
        }
        this.modelManager.insert(list)
    }
    // 重写
    // public getHolder(node: Node, code: string): Holder<ITestModel, ScrollAdapter<ITestModel>> {
    //     return new MyHolder(node, code, this)
    // }
}
class MyHolder extends Holder {
    protected onCreated(): void {
    }
    protected onVisible(): void {
    }
    protected onDisable(): void {
    }
}