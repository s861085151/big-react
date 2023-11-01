import { Props, Key, Ref, ReactElementType } from 'shared/ReactTypes';
import { FunctionComponent, HostComponent, WorkTag } from './workTags';
import { Flags, NoFlags } from './filberFlags';
import { Container } from 'hostConifg';

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
	memoizedState: any;
	updateQueue: unknown;
	alternate: FiberNode | null;
	flags: Flags;
	subtreeFlags: Flags;

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
		this.memoizedState = null;
		this.updateQueue = null;

		this.alternate = null;
		// 副作用
		this.flags = NoFlags;
		this.subtreeFlags = NoFlags;
	}
}

export class FiberRootNode {
	container: Container;
	current: FiberNode;
	finishedWork: FiberNode | null;
	constructor(container: Container, hostRootFiber: FiberNode) {
		this.container = container;
		this.current = hostRootFiber;
		hostRootFiber.stateNode = this;
		this.finishedWork = null;
	}
}

export const createWorkInProgress = (
	current: FiberNode,
	pendingProps: Props
): FiberNode => {
	let wip = current.alternate;

	if (wip === null) {
		// mount
		wip = new FiberNode(current.tag, pendingProps, current.key);
		wip.stateNode = current.stateNode;

		wip.alternate = current;
		current.alternate = wip;
	} else {
		// update
		wip.pendingProps = pendingProps;
		// 清除副作用(上次一更新遗留的)
		wip.flags = NoFlags;
		wip.subtreeFlags = NoFlags;
	}
	wip.type = current.type;
	wip.updateQueue = current.updateQueue;
	wip.child = current.child;
	wip.memoizedProps = current.memoizedProps;
	wip.memoizedState = current.memoizedState;

	return wip;
};

export const createFiberFromElement = (elememt: ReactElementType) => {
	const { type, key, props } = elememt;
	let workTag: WorkTag = FunctionComponent;

	if (typeof type === 'string') {
		// 'div'
		workTag = HostComponent;
	} else if (typeof type !== 'function' && __DEV__) {
		console.warn('未实现的type', elememt);
	}
	const fiber = new FiberNode(workTag, props, key);
	return fiber;
};
