// 递归中的递阶段

import { ReactElementType } from 'shared/ReactTypes';
import { FiberNode } from './fiber';
import { UpdateQueue, processUpdateQueue } from './updateQueue';
import { HostComponent, HostRoot, HostText } from './workTags';
import { mountChildFibers, reconcileChildFibers } from './childFibers';

export const beginWork = (wip: FiberNode) => {
	// 比较 生产子FilterNode
	switch (wip.tag) {
		case HostRoot:
			return updateHostRoot(wip);
		case HostComponent:
			return updateHostComponent(wip);

		case HostText:
			return null;

		default:
			if (__DEV__) {
				console.warn('beginWork为实现的类型');
			}
			break;
	}

	return null;
};

// render ReactDom.createRoot(element).render(<App/>) ReactDom.render()
function updateHostRoot(wip: FiberNode) {
	const baseState = wip.memoizedState;
	const updateQueue = wip.updateQueue as UpdateQueue<Element>;
	const pending = updateQueue.shared.pending;
	updateQueue.shared.pending = null;
	const { memoizedState } = processUpdateQueue(baseState, pending);
	wip.memoizedState = memoizedState;

	// 更新根节点 更新后的值是根节点的children，不是function
	const nextChildren = wip.memoizedState; // element
	//wip.alternate?.child是当前的fiberNode
	// wip.alternate?.child
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function updateHostComponent(wip: FiberNode) {
	const nextProps = wip.pendingProps;
	const nextChildren = nextProps.children;
	reconcileChildren(wip, nextChildren);
	return wip.child;
}

function reconcileChildren(wip: FiberNode, children?: ReactElementType) {
	const current = wip.alternate;

	if (current === null) {
		// mount  离屏渲染
		wip.child = mountChildFibers(wip, null, children);
	} else {
		wip.child = reconcileChildFibers(wip, current.child, children);
	}
}
