import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactElement,
  ReactNode,
} from "react";
import classNames from "classnames";
import styles from "./tabs.module.css";
import { Text } from "../atoms";

interface TabsProps {
  children: ReactElement<TabsItemProps> | ReactElement<TabsItemProps>[];
}

interface TabsItemProps {
  text?: string;
  index?: number;
  style?: React.CSSProperties;
  className?: string;
  children: ReactElement | ReactElement[];
  onClick?: () => void;
}

interface TabsContextProps {
  activeTab: number;
  setActiveTab: (index: number) => void;
  setRenderChildren: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  renderChildren: React.ReactNode;
}

const TabsContext = createContext({} as TabsContextProps);
const { Provider } = TabsContext;

export const TabsProvider = ({ children }: { children: ReactNode }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [renderChildren, setRenderChildren] = useState<React.ReactNode>(null);

  return (
    <Provider
      value={{ activeTab, setActiveTab, setRenderChildren, renderChildren }}
    >
      {children}
    </Provider>
  );
};

export const TabsItem = ({
  text,
  index,
  onClick = () => {},
  style,
  className = "",
  children,
}: TabsItemProps) => {
  const { activeTab, setActiveTab, setRenderChildren } =
    useContext(TabsContext);

  const clickTab = () => {
    if (index !== undefined) {
      onClick();
      setActiveTab(index);
    }
  };

  useEffect(() => {
    if (index === activeTab) {
      setRenderChildren(children);
    }
  }, [activeTab, index, children]);

  const isActive = index === activeTab;

  return (
    <div className={`${styles.tabItem} ${className}`} style={style}>
      <button
        onClick={clickTab}
        className={classNames(styles.btn, {
          [styles.active]: isActive,
          [styles.inactive]: !isActive,
        })}
      >
        <Text
          size="input"
          as="span"
          color={isActive ? "primary" : "contrast"}
          className={styles.text}
        >
          {text}
        </Text>
      </button>
    </div>
  );
};

export const TabsBody = () => {
  const { renderChildren } = useContext(TabsContext);
  return <div className={styles.tabsBody}>{renderChildren}</div>;
};

export function Tabs({ children }: TabsProps) {
  return (
    <div className={styles.tabs}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            index: Number(index),
          });
        }
        return child;
      })}
    </div>
  );
}

Tabs.Item = TabsItem;
Tabs.Body = TabsBody;
