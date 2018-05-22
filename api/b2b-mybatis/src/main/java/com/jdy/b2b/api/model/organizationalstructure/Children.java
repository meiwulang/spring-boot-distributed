package com.jdy.b2b.api.model.organizationalstructure;

import java.util.*;

/**
 * Created by zhangfofa on 2017/11/16.
 */
public class Children {
    private List list = new ArrayList();

    public int getSize() {
        return list.size();
    }

    public void addChild(Node node) {
        list.add(node);
    }

    // 拼接孩子节点的JSON字符串
    public String toString() {
        String result = "[";
        for (Iterator it = list.iterator(); it.hasNext();) {
            result += ( it.next()).toString();
            result += ",";
        }
        result = result.substring(0, result.length() - 1);
        result += "]";
        return result;
    }

    // 孩子节点排序
    public void sortChildren() {
        // 对本层节点进行排序
        // 可根据不同的排序属性，传入不同的比较器，这里传入ID比较器
        Collections.sort(list, new NodeIDComparator());
        // 对每个节点的下一层节点进行排序
        for (Iterator it = list.iterator(); it.hasNext();) {
            ((Node) it.next()).sortChildren();
        }
    }

    class NodeIDComparator implements Comparator {
        // 按照节点编号比较
        public int compare(Object o1, Object o2) {
            int j1 = (int)(((Node)o1).getId().toCharArray()[0]);
            int j2 = (int)(((Node)o2).getId().toCharArray()[0]);
            return (j1 > j2 ? -1 : (j1 == j2 ? 0 : 1));
        }
    }
}
