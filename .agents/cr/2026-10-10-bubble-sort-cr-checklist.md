# Code Review Checklist

> **Change** `bubble-sort` · **分支/Commit** `AI/task-DEV-66a2f4f2` / `6d8a7e1` · **日期** `2026-10-10`
>
> **AI**：唯一进度源；状态仅用 `⬜` `✅` `❌` `⚠️` `N/A`。
> **完成标准**：所有核销项必须从 `⬜` 变为其他状态；`N/A` 需写原因。
>
> **执行顺序（强制）**：写入本清单并进入逐文件审查前，先在目标仓库对变更路径运行 `references/script/scan-all-rules.sh`，将输出贴入 Step 3 和 Step 4 备注；再用 LLM 完成 Step 2–5 中脚本未覆盖项及复核。

---

## Step 1 — 执行队列（产物 A）

> **脚本预扫结果**：`bash scan-all-rules.sh src/main/java/com/antdigital/algorithm/ src/test/java/com/antdigital/algorithm/` → `=== No findings. 52/222 rules scanned ===`

| # | 文件（仓库相对路径） | 归属原因 | Step2 | Step3 | 总状态 |
|---|----------------------|----------|-------|-------|--------|
| 1 | `src/main/java/com/antdigital/algorithm/BubbleSort.java` | REQ-1/REQ-2 | ✅ | ✅ | ✅ 已审 |
| 2 | `src/test/java/com/antdigital/algorithm/BubbleSortTest.java` | REQ-1 验证 | ✅ | ✅ | ✅ 已审 |

- 非.Java 文件（`.gitignore`、`pom.xml`）：跳过（非 Java）

---

## Step 2 — 功能（产物 B）

> REQ 来源：需求描述「写一个冒泡排序，java实现」

| REQ | Scenario | Spec证据（原文/章节） | 关联文件 | 状态 | 代码证据（文件/测试/接口） |
|-----|----------|----------------------|----------|------|----------------------------|
| REQ-1 | Given 整型数组，When 调用 BubbleSort.sort()，Then 返回升序排列的新数组 | 需求描述："写一个冒泡排序，java实现" | `BubbleSort.java:26-55` / `BubbleSortTest.java` | ✅ | `BubbleSort.java:36-52` 双层循环+交换实现冒泡；`BubbleSortTest.java:21-30` 验证无序数组排序结果 |
| REQ-2 | Given null输入，When 调用 sort()，Then 抛出 IllegalArgumentException | 需求描述隐含防御性编程要求 | `BubbleSort.java:28-30` / `BubbleSortTest.java:111-120` | ✅ | `BubbleSort.java:28` 卫语句 null 校验；`BubbleSortTest.java:117-119` 异常断言 |

---

## Step 3 — 可读性检查（产物 C）

> 对照 `references/readability-checklist.md` A1–A7 逐节核销：
> 预扫脚本（52条覆盖）无命中，以下为 LLM 逐条复核。

| ID | 检查项 | 状态 | 备注（命中写 `path:line`） |
|----|--------|------|----------------------------|
| A1 | 源文件格式 | ✅ | A1.1 文件名=类名.java ✅；A1.2 UTF-8 ✅；A1.3 无Tab，4空格缩进 ✅ |
| A2 | 源文件结构/import 顺序 | ✅ | A2.1 package→import→类 ✅；A2.2 无通配符import ✅；A2.3 静态/非静态import分组空行分隔（BubbleSortTest.java:3-7）✅；A2.4 组内字典序 ✅ |
| A3 | 代码样式 | ✅ | A3.1 K&R大括号 ✅；A3.3 4空格缩进 ✅；A3.4 行宽≤120 ✅；A3.6 成员间空行 ✅；A3.7 `if (` 空格 ✅；A3.8 运算符两侧空格 ✅ |
| A4 | 命名规范 | ✅ | A4.1 包名全小写 ✅；A4.2 类名UpperCamelCase ✅；A4.3 方法名lowerCamelCase ✅；A4.5 变量lowerCamelCase ✅；A4.7 测试类名=被测类+Test ✅ |
| A5 | 编码实践 | ✅ | A5.3 静态方法用类名调用（BubbleSortTest.java:26）✅；A5.4 无finalize() ✅ |
| A6 | 特定元素样式 | ✅ | A6.1 `int[] array` 类型前置 ✅；A6.3 修饰符顺序 `public final class`/`public static` ✅ |
| A7 | Javadoc 规范 | ✅ | A7.1 public类及public方法有Javadoc ✅；A7.2 `@param→@return→@throws`顺序 ✅；A7.4 `<p>` 分段 ✅ |

---

## Step 4 — 可靠性检查（产物 D）

> **脚本预扫**：`scan-all-rules.sh` 输出 `No findings. 52/222 rules scanned`
> 以下为 LLM 逐条核对脚本未覆盖项。

### 4.1 Bug 模式（`bug-pattern-checklist.md`）

> 本变更仅涉及纯算法实现（int[]排序），无集合/线程/IO/日期/SQL/序列化/反射等场景。
> 以下逐条核销；与本次变更无关的 ID 标 `N/A` 并写原因。

| ID | 状态 | 备注 |
|----|------|------|
| B001 | N/A | 无parse/of字面量调用 |
| B002 | ✅ | 无array.equals()引用比较 |
| B003 | N/A | 无Arrays.fill |
| B004 | ✅ | 无array.toString() |
| B005 | N/A | 无Arrays.asList |
| B006 | N/A | 使用AssertJ非assertEquals |
| B007 | N/A | 无catch(Throwable) |
| B008 | N/A | 无Executors |
| B009 | N/A | 无位移操作 |
| B010 | N/A | 无BigDecimal |
| B011 | N/A | 无包装类型==比较 |
| B012 | N/A | 无Calendar |
| B013 | N/A | 无Calendar |
| B014 | N/A | 无集合查询 |
| B015 | N/A | 无toArray |
| B016 | N/A | 无Comparable |
| B017 | N/A | 无this==null |
| B018 | N/A | 无三目运算 |
| B019 | N/A | 无Money类 |
| B020 | N/A | 无常量乘法溢出 |
| B021 | N/A | 无Jedis |
| B022 | N/A | 无SimpleDateFormat |
| B023 | N/A | 无未抛出异常 |
| B024 | N/A | 无未启动Thread |
| B025 | N/A | 无双括号初始化 |
| B026 | N/A | 无equals(null) |
| B027 | N/A | 无equals实现 |
| B028 | N/A | 无DateUtil |
| B029 | N/A | 无setter |
| B030 | N/A | 无浮点==比较 |
| B031 | N/A | 无String.format |
| B032 | N/A | 无注解getClass() |
| B033 | N/A | 无Unsafe |
| B034 | N/A | 无Hashtable |
| B035 | ✅ | 无同一对象二元运算（BubbleSort.java:42 比较result[j]与result[j+1]不同元素） |
| B036 | N/A | 无IdentityHashMap |
| B037 | N/A | 无可变参数 |
| B038 | N/A | 无递归 |
| B039 | N/A | 无indexOf |
| B040 | N/A | 无isInstance |
| B041 | N/A | 无JDBC连接 |
| B042 | N/A | 非JUnit3 |
| B043 | N/A | 无内部类@Test |
| B044 | N/A | 非JUnit3+JUnit4混用 |
| B045 | N/A | 无synchronized(包装类型) |
| B046 | ✅ | 循环条件正确更新：BubbleSort.java:36 i++、:41 j++，无死循环 |
| B047 | N/A | 无数值compare类型转换 |
| B048 | N/A | 无Math.round |
| B049 | N/A | 无日期格式DD |
| B050 | N/A | 无日期格式hh |
| B051 | N/A | 无Boolean.getBoolean |
| B052 | N/A | 无YYYY格式 |
| B053 | ✅ | 异常测试使用assertThatThrownBy（BubbleSortTest.java:117），无需手动fail() |
| B054 | N/A | 无EqualsTester |
| B055 | N/A | 无Mockito |
| B056 | N/A | 无Arrays.asList().add() |
| B057 | N/A | 无增强for循环修改集合 |
| B058 | N/A | 无集合自身操作 |
| B059 | N/A | 无nCopies |
| B060 | N/A | 无三目运算含null |
| B061 | N/A | 无sun.misc.BASE64Encoder |
| B062 | N/A | 无ClassLoader强转 |
| B063 | N/A | 无javax.xml |
| B064 | N/A | 无Optional==比较 |
| B065 | N/A | 无Pojo自赋值 |
| B066 | N/A | 无Math.random()强转 |
| B067 | N/A | 无Random.nextInt()% |
| B068 | ✅ | 无自赋值；BubbleSort.java:65-67 swap正确交换两个不同下标 |
| B069 | N/A | 无compareTo |
| B070 | N/A | 无self equals |
| B071 | N/A | 无size()>=0 |
| B072 | N/A | 无Stream.toString() |
| B073 | N/A | 无StringBuilder(char) |
| B074 | N/A | 无substring(0) |
| B075 | ✅ | for循环条件与增量方向一致：BubbleSort.java:36 i<n-1;i++、:41 j<n-1-i;j++ |
| B076 | N/A | 无@Transactional |
| B077 | N/A | 无catch(Throwable) |
| B078 | ✅ | 无assertThat(x).isEqualTo(x)；所有断言比较不同对象 |
| B079 | N/A | 无@Mock |
| B080 | ✅ | 所有测试方法含断言（assertThat/assertThatThrownBy） |
| B081 | N/A | 无新建集合sort后未使用 |
| M001 | ✅ | 无连续相同条件判断 |
| M002 | N/A | 无instanceof |
| M003 | N/A | 无包装类构造器 |
| M004 | N/A | 无printStackTrace() |
| M005 | ✅ | BubbleSortTest为顶层类非内部类，无需static |
| M006 | N/A | 无编译期布尔常量 |
| M007 | N/A | 无空catch块 |
| M008 | N/A | 未重写equals/hashCode |
| M009 | N/A | 无不兼容类型equals |
| M010 | N/A | 无位运算 |
| M011 | N/A | 无switch |
| M012 | N/A | 无finally return/throw |
| M013 | N/A | 无浮点强转 |
| M014 | N/A | 无枚举getClass() |
| M015 | N/A | 无字段隐藏 |
| M016 | N/A | 无默认时区方法 |
| M017 | N/A | 所有测试方法有@Test注解 |
| M018 | N/A | 无lock() |
| M019 | N/A | 无switch枚举 |
| M020 | N/A | 无重写缺@Override |
| M021 | N/A | 无非重写equals |
| M022 | N/A | 无Optional.of(null) |
| M023 | N/A | 无toString()输出无意义 |
| M024 | N/A | 无Optional.get() |
| M025 | ✅ | BubbleSort.java:14 final类无protected成员 |
| M026 | N/A | 无@Mock static |
| M027 | N/A | 无ThreadLocal |
| I001 | ✅ | 异常测试断言了消息内容（BubbleSortTest.java:119 hasMessageContaining） |
| I002 | N/A | 无@DoNotMock |
| I003 | N/A | 无@AutoValue |
| I004 | N/A | 无java.util.Date |
| I005 | N/A | 非JUnit3 |
| I006 | N/A | 无setUp() |
| I007 | N/A | 无tearDown() |
| I008 | N/A | 无dataProvider |
| I009 | ✅ | 8个测试方法均为有效单测 |
| I010 | N/A | 无容器依赖测试 |

### 4.2 可靠性（`reliability-checklist.md`）

> 本变更无并发/MQ/缓存/调度/RPC/事务/资金/灰度/监控等场景，多数类别为 N/A。

| ID | 状态 | 备注 |
|----|------|------|
| G1.1 | N/A | 无并发/事务场景（纯内存计算） |
| G1.2 | N/A | 同上 |
| G1.3 | N/A | 同上 |
| G1.4 | N/A | 同上 |
| G2.1 | N/A | 无写接口/消息消费 |
| G2.2 | N/A | 同上 |
| G2.3 | N/A | 同上 |
| G3.1 | N/A | 无分布式事务 |
| G3.2 | N/A | 无@Transactional |
| G4.1 | N/A | 无SQL |
| G4.2 | N/A | 同上 |
| G4.3 | N/A | 同上 |
| G5.1 | N/A | 无MQ |
| G6.1 | N/A | 无缓存 |
| G6.2 | N/A | 同上 |
| G7.1 | N/A | 无调度任务 |
| G7.2 | N/A | 同上 |
| G8.1 | N/A | 无catch块（纯算法无异常路径） |
| G8.2 | N/A | 无外部依赖 |
| G8.3 | N/A | 无IO/连接/锁资源 |
| G8.4 | N/A | 无线程池/定时任务 |
| G8.5 | N/A | 无ThreadLocal |
| G8.6 | N/A | 无线程池 |
| G9.1 | N/A | 无外部调用 |
| G9.2 | N/A | 同上 |
| G9.3 | N/A | 同上 |
| G10.1 | N/A | 无接口契约字段 |
| G10.2 | N/A | 同上 |
| G11.1 | ✅ | 新逻辑有单测且含断言（BubbleSortTest.java 8个测试方法） |
| G11.2 | ✅ | 覆盖边界：空数组✅、单元素✅、已排序✅、逆序✅、重复✅、负数✅、null✅ |
| G11.3 | ✅ | 入参null有防御性校验（BubbleSort.java:28-30） |
| G11.4 | ✅ | int比较无溢出/除零/精度问题；无金额运算 |
| G12.1 | N/A | 无资金场景 |
| G12.2 | N/A | 同上 |
| G13.1 | N/A | 无日志/监控 |
| G14.1 | N/A | 无金额/币种 |
| G14.2 | N/A | 无多租户 |
| G14.3 | N/A | 无时区 |
| G14.4 | N/A | 同上 |
| G15.1 | N/A | 无数据库变更 |
| G15.2 | N/A | 无接口共存 |
| G15.3 | N/A | 同上 |
| G16.1 | N/A | 无核心链路监控 |
| G16.2 | N/A | 无异常日志（纯算法无catch） |
| G16.3 | N/A | 同上 |
| G16.4 | N/A | 无空catch |
| G17.1 | N/A | 无功能开关（纯算法工具类） |
| G17.2 | N/A | 同上 |
| G17.3 | N/A | 同上 |
| G18.1 | N/A | 无安全补强场景 |
| G18.2 | N/A | 同上 |
| G18.3 | N/A | 同上 |

### 4.3 安全（`security-checklist.md`）

> 本变更无SQL/Web/文件/反序列化/访问控制等场景，全部 N/A。

| ID | 状态 | 备注 |
|----|------|------|
| S1.1 | N/A | 无SQL |
| S1.2 | N/A | 同上 |
| S1.3 | N/A | 同上 |
| S2.1 | N/A | 无HTML/JS输出 |
| S2.2 | N/A | 同上 |
| S2.3 | N/A | 同上 |
| S3.1 | N/A | 无URL请求 |
| S3.2 | N/A | 同上 |
| S3.3 | N/A | 同上 |
| S4.1 | N/A | 无系统命令 |
| S4.2 | N/A | 同上 |
| S5.1 | N/A | 无XML解析 |
| S5.2 | N/A | 同上 |
| S6.1 | N/A | 无反序列化 |
| S6.2 | N/A | 同上 |
| S6.3 | N/A | 同上 |
| S7.1 | N/A | 无文件上传 |
| S7.2 | N/A | 同上 |
| S7.3 | N/A | 同上 |
| S8.1 | N/A | 无接口鉴权（工具类） |
| S8.2 | N/A | 同上 |
| S8.3 | N/A | 同上 |
| S8.4 | N/A | 同上 |
| S9.1 | N/A | 无密钥 |
| S9.2 | N/A | 同上 |
| S9.3 | N/A | 同上 |
| S9.4 | N/A | 同上 |
| S10.1 | N/A | 无CSRF |
| S10.2 | N/A | 无CORS |
| S10.3 | N/A | 无URL跳转 |

---

## Step 5 — 自定义扩展检查（产物 E）

> `customized-checklist.md` 仅含示例项（U1.1），U2 为空，未启用自定义规则。

| ID | 状态 | 备注 |
|----|------|------|
| U1.1 | N/A(未启用自定义规则) | 示例项，无Controller入参 |
| U1.2 | N/A(未启用自定义规则) | 无 |
| U1.3 | N/A(未启用自定义规则) | 无 |
| U2.1 | N/A(未启用自定义规则) | 无 |
| U2.2 | N/A(未启用自定义规则) | 无 |
| U2.3 | N/A(未启用自定义规则) | 无 |

---

## 终检（防漏检）

- [x] 执行队列中每个文件 `Step2`、`Step3`、**S1–S10 / G1–G17** 各列均非 `⬜`（跳过文件除外）；
- [x] Step 2 的每个 REQ/Scenario 均非 `⬜`
- [x] Step 3 的 A1–A7 均非 `⬜`
- [x] Step 4 全部 **G/S** 与 **B001–B081 / M001–M027 / I001–I010** ID 均非 `⬜`（允许 `N/A`，但有原因）
- [x] Step 5 全部 U* ID 均非 `⬜`（`N/A(未启用自定义规则)`）
- [x] 所有 `❌/⚠️` 已写入 report（本次无 `❌/⚠️`）
