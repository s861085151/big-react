import { Props, Key, Ref } from 'shared/ReactTypes';
import { WorkTag } from './workTags';
import { Flags, NoFlags } from './filberFlags';

export class FiberNode {
	type: any;
	tag: WorkTag;
	key: Key;
	stateNode: any;
	ref: Ref;

	return: FiberNode | null;
	sibling: FiberNode | null;
	child: FiberNode | null;
	index: number;

	pendingProps: Props;
	memoizedProps: Props | null;
	alternate: FiberNode | null;
	flags: Flags;

	constructor(tag: WorkTag, pendingProps: Props, key: Key) {
		//---------------------实例-----------------------
		this.tag = tag;
		this.key = key;
		// HostComponent <div> divDOM
		this.stateNode = null;
		// tag的类型 FunctionComponent () => {}
		this.type = null;

		//---------------------树桩结构-----------------------
		// 指向父fiberNode
		this.return = null;
		// 指向右侧兄弟fiberNode
		this.sibling = null;
		// 指向子fiberNode
		this.child = null;
		// 下标
		this.index = 0;
		this.ref = null;

		//---------------------作为工作单元-----------------------
		// 工作的props
		this.pendingProps = pendingProps;
		// 完成的props
		this.memoizedProps = null;

		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
	}
}
