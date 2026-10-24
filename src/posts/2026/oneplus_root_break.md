---
title: 记一次刷ReSukiSU
date: 2026-08-22
tag:
  - 安卓
category:
  - Android
---

之前用的KernelSU Next，然后一次系统更新没管刷到新槽位的问题直接就没了。  
<!-- more -->
后来想试一下ReSukiSU，通过修补init_boot.img文件后手机无限重启，然后紧急刷回原来的init_boot.img，试了其他几个KSU分支都不行，最后突发奇想刷个Magisk进去，然后成功开机，模块还能用。然后用了一段时间怀疑是有残留的ksu和ksud文件，尝试把/data/adb中的ksu和ksud删了，然后刷ReSukiSU成功开机并且稳定运行。  
我也不知道为什么，问ChatGPT也没问出什么来。