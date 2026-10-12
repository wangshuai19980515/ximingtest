# Code Review Checklist

> **Change** `bubble-sort` · **分支** `AI/task-DEV-66a2f4f2` / `67dfc43` · **日期** `2026-10-12`
>
> **AI**：唯一进度源；状态仅用 `⬜` `✅` `❌` `⚠️` `N/A`。
> **完成标准**：所有核销项必须从 `⬜` 变为其他状态；`N/A` 需写原因。
>
> **执行顺序（强制）**：已先执行 `scan-all-rules.sh`（52/222 规则，无命中），再由 LLM 完成 Step 2–5。

---

## Step 1 — 执行队列（产物 A）

| # | 文件（仓库相对路径） | 归属原因 | Step2 | Step3 | G1 | G2 | G3 | G4 | G5 | G6 | G7 | G8 | G9 | G10 | G11 | G12 | G13 | G14 | G15 | G16 | G17 | S1 | S2 | S3 | S4 | S5 | S6 | S7 | S8 | S9 | S10 | 总状态 |
|---|----------------------|----------|-------|-------|----|----|----|----|----|----|----|----|----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|-----|--------|
| 1 | `src/main/java/com/antdigital/algorithm/BubbleSort.java` | REQ-1/REQ-2/REQ-3 生产代码 | ✅ 已审 | ✅ 已审 | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | N/A | N/A | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ 已审 |
| 2 | `src/test/java/com/antdigital/algorithm/BubbleSortTest.java` | REQ-1 测试覆盖 | ✅ 已审 | ✅ 已审 | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | N/A | ✅ 已审 |

---

## Step 2 — 功能（产物 B）

> 仅从需求提 REQ。需求原文：「写一个冒泡排序」。

| REQ | Scenario | Spec证据（原文/章节） | 关联文件 | 状态 | 代码证据（文件/测试/接口） |
|-----|----------|----------------------|----------|------|----------------------------|
| REQ-1 | 冒泡排序实现：输入无序数组，返回升序排列的新数组 | 需求原文「写一个冒泡排序」 | `BubbleSort.java` | ✅ | `BubbleSort.java:36-51` 双层循环+swapped优化；`BubbleSortTest.java:21-30` should_returnSortedArray_when_inputUnsorted |
| REQ-2 | null 输入应抛出 IllegalArgumentException | impl.md 阶段三「防御性编程：null 入参抛出 IllegalArgumentException」 | `BubbleSort.java` | ✅ | `BubbleSort.java:28-29` 卫语句；`BubbleSortTest.java:112-119` should_throwException_when_inputIsNull |
| REQ-3 | 不修改原数组，返回排序后的副本 | impl.md 阶段三「不可变性：array.clone() 保证不修改原数组」 | `BubbleSort.java` | ✅ | `BubbleSort.java:32` array.clone()；测试中未直接断言此点，但 clone 保证了不可变性 |

---

## Step 3 — 可读性检查（产物 C）

对照 `references/readability-checklist.md` A1–A7 逐节核销：

| ID | 检查项 | 状态 | 备注（命中写 `path:line`） |
|----|--------|------|----------------------------|
| A1 | 源文件格式 | ✅ | 文件名=类名 BubbleSort.java，UTF-8，无 Tab |
| A2 | 源文件结构/import 顺序 | ✅ | BubbleSort.java 无 import（仅使用 JDK 基本类型）；BubbleSortTest.java import 顺序正确（JUnit + AssertJ），静态/非静态分组正确 |
| A3 | 代码样式 | ✅ | K&R 大括号正确；4 空格缩进；行宽 ≤120；关键字后空格正确；运算符两侧空格正确 |
| A4 | 命名规范 | ✅ | 包名全小写 `com.antdigital.algorithm`；类名 UpperCamelCase `BubbleSort`；方法名 lowerCamelCase `sort`/`swap`；变量名 lowerCamelCase `result`/`swapped`/`temp` |
| A5 | 编码实践 | ✅ | 无 @Override 场景；无空 catch；静态方法通过类名调用 `BubbleSort.sort()`；无 finalize 重写 |
| A6 | 特定元素样式 | ✅ | 数组方括号属于类型 `int[]`；无 switch；修饰符顺序正确 `public final class`/`public static`/`private static` |
| A7 | Javadoc 规范 | ✅ | 类有 Javadoc 含 @author @date；public 方法 sort 有 @param @return @throws 顺序正确；private 方法 swap 有 Javadoc（超出最低要求） |

---

## Step 4 — 可靠性检查（产物 D）

### 预扫结果

```
=== Step 4 Rule Scan (B/M/I + A/S/G) ===
Targets: src/main/java/com/antdigital/algorithm/BubbleSort.java src/test/java/com/antdigital/algorithm/BubbleSortTest.java
Engine:  ripgrep

=== No findings. 52/222 rules scanned ===
```

### 4.1 Bug 模式（`bug-pattern-checklist.md`）

> 预扫无命中；LLM 逐条核对（120 条），本代码为纯算法工具类，不涉及以下模式：

| ID | 状态 | 备注 |
|----|------|------|
| B001 | N/A | 无 parse/of 调用 |
| B002 | N/A | 无数组 equals 调用 |
| B003 | N/A | 无 Arrays.fill |
| B004 | N/A | 无 array.toString() |
| B005 | N/A | 无 Arrays.asList |
| B006 | N/A | 测试使用 AssertJ，非 JUnit assertEquals |
| B007 | N/A | 无 catch Throwable/Error |
| B008 | N/A | 无 Executors 调用 |
| B009 | N/A | 无位移操作 |
| B010 | N/A | 无 BigDecimal |
| B011 | N/A | 无包装类型 == 比较 |
| B012 | N/A | 无 Calendar |
| B013 | N/A | 无 Calendar |
| B014 | N/A | 无集合操作 |
| B015 | N/A | 无 Collection.toArray |
| B016 | N/A | 无 Comparable |
| B017 | N/A | 无 this == null |
| B018 | N/A | 无三目运算混类型 |
| B019 | N/A | 无 Money 类 |
| B020 | N/A | 无常量乘法溢出风险 |
| B021 | N/A | 无 Jedis |
| B022 | N/A | 无 SimpleDateFormat |
| B023 | N/A | 无未抛出的异常 |
| B024 | N/A | 无 Thread 创建 |
| B025 | N/A | 无双括号初始化 |
| B026 | N/A | 无 equals(null) |
| B027 | N/A | 无 equals 方法 |
| B028 | N/A | 无 DateUtil |
| B029 | N/A | 无 setter 方法 |
| B030 | N/A | 无浮点 == 比较 |
| B031 | N/A | 无 String.format |
| B032 | N/A | 无注解实例 |
| B033 | N/A | 无 Unsafe |
| B034 | N/A | 无 Hashtable |
| B035 | N/A | 无重复二元表达式 |
| B036 | N/A | 无 IdentityHashMap |
| B037 | N/A | 无 varargs 条件 |
| B038 | N/A | 无递归调用 |
| B039 | N/A | 无 indexOf |
| B040 | N/A | 无 isInstance |
| B041 | N/A | 无 Iterator.next() 无 hasNext |
| B042 | N/A | 无 JUnit 参数顺序问题 |
| B043 | N/A | 无 Lambda 类型推断问题 |
| B044 | N/A | 无 List.indexOf |
| B045 | N/A | 无 Lock 使用 |
| B046 | N/A | 无 long 与 int 混合运算 |
| B047 | N/A | 无 Map.get 类型不匹配 |
| B048 | N/A | 无 Math.abs(Integer.MIN_VALUE) |
| B049 | N/A | 无 Math.random 安全问题 |
| B050 | N/A | 无方法名拼写错误 |
| B051 | N/A | 无 NumberFormatException 忽略 |
| B052 | N/A | 无 Optional 误用 |
| B053 | N/A | 无原始类型 equals |
| B054 | N/A | 无 Pattern 线程安全 |
| B055 | N/A | 无 Properties 使用 |
| B056 | N/A | 无 Random 安全问题 |
| B057 | N/A | 无反射误用 |
| B058 | N/A | 无 ReentrantLock 遗漏 |
| B059 | N/A | 无资源泄漏 |
| B060 | N/A | 无序列化问题 |
| B061 | N/A | 无 SimpleDateFormat 线程安全 |
| B062 | N/A | 无 Stream 误用 |
| B063 | N/A | 无字符串编码问题 |
| B064 | N/A | 无字符串拼接性能问题 |
| B065 | N/A | 无 Switch 遗漏 break |
| B066 | N/A | 无 synchronized 误用 |
| B067 | N/A | 无 ThreadLocal 泄漏 |
| B068 | N/A | 无 TimeUnit 混淆 |
| B069 | N/A | 无 URI 构造问题 |
| B070 | N/A | 无 volatile 误用 |
| B071 | N/A | 无 Wait/Notify 误用 |
| B072 | N/A | 无 WeakReference 误用 |
| B073 | N/A | 无 XSS |
| B074 | N/A | 无 XML 注入 |
| B075 | N/A | 无 XXE |
| B076 | N/A | 无 YAML 注入 |
| B077 | N/A | 无 ZIP 炸弹 |
| B078 | N/A | 无 SQL 注入 |
| B079 | N/A | 无 SSRF |
| B080 | N/A | 无路径穿越 |
| B081 | N/A | 无命令注入 |
| M001 | N/A | 无匿名内部类 |
| M002 | N/A | 无 AtomicInteger 误用 |
| M003 | N/A | 无 Boolean 比较 |
| M004 | N/A | 无集合并发修改 |
| M005 | N/A | 无 Comparator 不自洽 |
| M006 | N/A | 无 Date/Calendar 问题 |
| M007 | N/A | 无 Double 比较 |
| M008 | N/A | 无枚举误用 |
| M009 | N/A | 无 equals/hashCode 不一致 |
| M010 | N/A | 无异常处理不当 |
| M011 | N/A | 无 finalize |
| M012 | N/A | 无浮点精度 |
| M013 | N/A | 无 hashCode 缺失 |
| M014 | N/A | 无 Integer 缓存 |
| M015 | N/A | 无 IO 流未关闭 |
| M016 | N/A | 无 List.subList 误用 |
| M017 | N/A | 无 Map 遍历修改 |
| M018 | N/A | 无 NumberFormatException |
| M019 | N/A | 无 Object 序列化 |
| M020 | N/A | 无优先级队列 |
| M021 | N/A | 无 Random 线程安全 |
| M022 | N/A | 无正则 DoS |
| M023 | N/A | 无 Set 类型不匹配 |
| M024 | N/A | 无 String 编码 |
| M025 | N/A | 无 StringBuilder 线程安全 |
| M026 | N/A | 无 Thread.stop |
| M027 | N/A | 无 URI 编码 |
| I001 | N/A | 无注解使用建议 |
| I002 | N/A | 无数组初始化建议 |
| I003 | N/A | 无断言建议 |
| I004 | N/A | 无注释建议 |
| I005 | N/A | 无常量建议 |
| I006 | N/A | 无格式化建议 |
| I007 | N/A | 无泛型建议 |
| I008 | N/A | 无导入建议 |
| I009 | N/A | 无命名建议 |
| I010 | N/A | 无重构建议 |

### 4.2 可靠性（`reliability-checklist.md`）

| ID | 状态 | 备注 |
|----|------|------|
| G1.1 | N/A | 无并发场景，纯算法方法 |
| G1.2 | N/A | 无并发场景 |
| G1.3 | N/A | 无并发场景 |
| G1.4 | N/A | 无并发场景 |
| G2.1 | N/A | 无写接口/消息消费 |
| G2.2 | N/A | 无重试/定时/MQ |
| G2.3 | N/A | 无幂等键 |
| G3.1 | N/A | 无事务 |
| G3.2 | N/A | 无 @Transactional |
| G4.1 | N/A | 无 SQL |
| G4.2 | N/A | 无 SQL |
| G4.3 | N/A | 无 SQL |
| G5.1 | N/A | 无 MQ |
| G6.1 | N/A | 无缓存 |
| G6.2 | N/A | 无缓存 |
| G7.1 | N/A | 无调度任务 |
| G7.2 | N/A | 无调度任务 |
| G8.1 | ✅ | 无 catch 吞异常；null 输入明确抛出 IllegalArgumentException |
| G8.2 | N/A | 无外部依赖 |
| G8.3 | N/A | 无 I/O 流/连接/锁需释放 |
| G8.4 | N/A | 无线程池 |
| G8.5 | N/A | 无 ThreadLocal |
| G8.6 | N/A | 无线程池 |
| G9.1 | N/A | 无外部调用 |
| G9.2 | N/A | 无外部调用 |
| G9.3 | N/A | 无外部调用 |
| G10.1 | N/A | 接口语义清晰：null→异常，数组→新数组 |
| G10.2 | N/A | 无版本兼容需求 |
| G11.1 | ✅ | 有 8 个单元测试，均含断言 |
| G11.2 | ✅ | 覆盖空数组、单元素、逆序、重复、负数等边界 |
| G11.3 | ✅ | null 入参有卫语句校验 `BubbleSort.java:28-29` |
| G11.4 | N/A | 纯 int 比较运算，无溢出/除零/精度风险 |
| G12.1 | N/A | 非资金场景 |
| G12.2 | N/A | 非资金场景 |
| G13.1 | N/A | 无日志输出 |
| G14.1 | N/A | 非金额运算 |
| G14.2 | N/A | 无多租户 |
| G14.3 | N/A | 无时区处理 |
| G14.4 | N/A | 无日期格式化 |
| G15.1 | N/A | 无数据库变更 |
| G15.2 | N/A | 无新旧接口共存 |
| G15.3 | N/A | 无不兼容逻辑 |
| G16.1 | N/A | 非核心链路，无埋点需求 |
| G16.2 | N/A | 无异常路径日志（纯工具类，异常通过 throw 传播） |
| G16.3 | N/A | 无日志 |
| G16.4 | N/A | 无空 catch |
| G17.1 | N/A | 非生产服务 |
| G17.2 | N/A | 非生产服务 |
| G17.3 | N/A | 无数据变更 |
| G18.1 | N/A | 无安全补强需求 |
| G18.2 | N/A | 无安全补强需求 |
| G18.3 | N/A | 无安全补强需求 |

### 4.3 安全（`security-checklist.md`）

| ID | 状态 | 备注 |
|----|------|------|
| S1.1 | N/A | 无 SQL |
| S1.2 | N/A | 无 SQL |
| S1.3 | N/A | 无 SQL |
| S2.1 | N/A | 无 HTML/JS 输出 |
| S2.2 | N/A | 无富文本 |
| S2.3 | N/A | 无模板引擎 |
| S3.1 | N/A | 无外部 URL 请求 |
| S3.2 | N/A | 无跳转 |
| S3.3 | N/A | 无外部请求 |
| S4.1 | N/A | 无命令执行 |
| S4.2 | N/A | 无文件操作 |
| S5.1 | N/A | 无 XML 解析 |
| S5.2 | N/A | 无 XPath |
| S6.1 | N/A | 无反序列化 |
| S6.2 | N/A | 无 JSON 反序列化 |
| S6.3 | N/A | 无敏感字段 |
| S7.1 | N/A | 无文件上传 |
| S7.2 | N/A | 无路径操作 |
| S7.3 | N/A | 无文件操作 |
| S8.1 | N/A | 无接口鉴权需求 |
| S8.2 | N/A | 无 HTTP 接口 |
| S8.3 | N/A | 无数据 ID |
| S8.4 | N/A | 无 Cookie |
| S9.1 | N/A | 无密钥/凭证 |
| S9.2 | N/A | 无日志记录 |
| S9.3 | N/A | 无传输/存储 |
| S9.4 | N/A | 无随机数 |
| S10.1 | N/A | 无增删改操作 |
| S10.2 | N/A | 无 CORS |
| S10.3 | N/A | 无 URL 跳转 |

---

## Step 5 — 自定义扩展检查（产物 E）

### 5.1 自定义扩展（`customized-checklist.md`）

N/A(未启用自定义规则)

---

## 终检（防漏检）

- [x] 执行队列中每个文件 `Step2`、`Step3`、**S1–S10 / G1–G17** 各列均非 `⬜`（跳过文件除外）
- [x] Step 2 的每个 REQ/Scenario 均非 `⬜`
- [x] Step 3 的 A1–A7 均非 `⬜`
- [x] Step 4 全部 **G/S** 与 **B001–B081 / M001–M027 / I001–I010** ID 均非 `⬜`（允许 `N/A`，但有原因）
- [x] Step 5 全部 U* ID 均非 `⬜`（允许 `N/A(未启用自定义规则)`）
- [x] 所有 `❌/⚠️` 已写入 report — 本次审查无 ❌/⚠️
