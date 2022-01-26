-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: localhost
-- Generation Time: 2021-04-02 09:59:13
-- 服务器版本： 5.6.50-log
-- PHP Version: 5.6.40

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ht_study_desk`
--

-- --------------------------------------------------------

--
-- 表的结构 `admin_user`
--

CREATE TABLE IF NOT EXISTS `admin_user` (
  `id` int(255) NOT NULL,
  `userName` varchar(255) DEFAULT NULL,
  `passWord` varchar(255) DEFAULT NULL,
  `power` int(20) DEFAULT NULL,
  `realName` varchar(11) NOT NULL,
  `createDate` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL,
  `mg_state` tinyint(1) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `updateDate` varchar(255) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `admin_user`
--

INSERT INTO `admin_user` (`id`, `userName`, `passWord`, `power`, `realName`, `createDate`, `role`, `mg_state`, `phone`, `updateDate`) VALUES
(1, 'admin', 'ht_123456', 99, 'admin', '2021-01-01', '超级管理员', 1, '1361111111', ''),
(3, 'llf', 'lu123456', 99, '卢校长', '2021-3-28 4:22:29', '超级管理员', 1, '13611111111', '2021-3-31 9:45:55'),
(10, 'zxd', 'zxd123', 10, '朱旭东', '2021-3-31 15:08:48', '教务主任', 1, '13611111111', '2021-3-31 15:08:48');

-- --------------------------------------------------------

--
-- 表的结构 `menus`
--

CREATE TABLE IF NOT EXISTS `menus` (
  `menus_id` smallint(6) unsigned NOT NULL,
  `menus_name` varchar(20) NOT NULL COMMENT '权限名称',
  `menus_pid` smallint(6) unsigned NOT NULL COMMENT '父id',
  `menus_c` varchar(32) NOT NULL DEFAULT '' COMMENT '控制器',
  `menus_a` varchar(32) NOT NULL DEFAULT '' COMMENT '操作方法',
  `menus_level` enum('0','2','1') NOT NULL DEFAULT '0' COMMENT '权限等级',
  `menus_path` varchar(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=160 DEFAULT CHARSET=utf8 COMMENT='权限表';

--
-- 转存表中的数据 `menus`
--

INSERT INTO `menus` (`menus_id`, `menus_name`, `menus_pid`, `menus_c`, `menus_a`, `menus_level`, `menus_path`) VALUES
(100, '用户管理', 0, '', '', '0', '0'),
(101, '权限管理', 0, '', '', '0', '0'),
(102, '学员管理', 0, '', '', '0', '0'),
(104, '学员列表', 102, 'Goods', 'index', '1', 'students'),
(110, '用户列表', 100, 'Manager', 'index', '1', 'users'),
(111, '角色列表', 101, 'Role', 'index', '1', 'roles'),
(113, '签到列表', 102, 'Goods', 'index', '1', 'signIn');

-- --------------------------------------------------------

--
-- 表的结构 `roles`
--

CREATE TABLE IF NOT EXISTS `roles` (
  `id` int(11) NOT NULL,
  `roleName` varchar(255) DEFAULT NULL,
  `roleDes` varchar(255) DEFAULT NULL,
  `updateDate` varchar(20) DEFAULT NULL,
  `createDate` varchar(20) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=60 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `roles`
--

INSERT INTO `roles` (`id`, `roleName`, `roleDes`, `updateDate`, `createDate`) VALUES
(1, '教师', '教师--能添加学生，但不能修改、删除学生信息；只能查询自己学生信息，能查询所有学生签到信息，并能进行学生签到', NULL, ''),
(2, '销售', '销售--能添加学生，但不能修改学生信息；能查询所有学生的部分信息，能查询所有学生签到信息，但不能进行学生签到', NULL, ''),
(10, '教务主任', '教务主任--能添加学生，但不能修改学生信息；能查询所有学生的部分信息，能查询所有学生签到信息，并能进行学生签到；', 'rights', ''),
(20, '销售主管', '销售主管--能添加学生，但不能修改学生信息；能查询所有学生的部分信息，能查询所有学生签到信息，但不能进行学生签到', 'orders', ''),
(99, '超级管理员', '校长--所有权限开放', 'goods', '');

-- --------------------------------------------------------

--
-- 表的结构 `signIn`
--

CREATE TABLE IF NOT EXISTS `signIn` (
  `siId` int(100) NOT NULL,
  `studentName` varchar(11) NOT NULL,
  `studentId` int(100) NOT NULL,
  `teacherName` varchar(11) NOT NULL,
  `phone` varchar(11) NOT NULL,
  `operator` varchar(11) NOT NULL COMMENT '操作人',
  `createDate` varchar(20) NOT NULL,
  `gender` tinyint(1) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `signIn`
--

INSERT INTO `signIn` (`siId`, `studentName`, `studentId`, `teacherName`, `phone`, `operator`, `createDate`, `gender`) VALUES
(7, '学员2', 5, '张老师', '13455677777', 'admin', '2021-04-01 12:03:45', 0),
(8, '学员2', 5, '张老师', '13455677777', 'admin', '2021-04-01 12:03:52', 0);

-- --------------------------------------------------------

--
-- 表的结构 `students`
--

CREATE TABLE IF NOT EXISTS `students` (
  `studentId` int(11) NOT NULL,
  `studentName` varchar(10) DEFAULT NULL,
  `age` tinyint(3) NOT NULL,
  `gender` tinyint(1) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `className` varchar(11) NOT NULL,
  `surplusClassTime` int(11) NOT NULL,
  `allClassTime` int(11) NOT NULL,
  `teacherName` varchar(11) NOT NULL,
  `updateDate` varchar(20) NOT NULL,
  `createDate` varchar(20) DEFAULT NULL,
  `valid` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否有效',
  `school` varchar(255) NOT NULL,
  `grade` varchar(20) NOT NULL,
  `addPeople` varchar(11) NOT NULL
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

--
-- 转存表中的数据 `students`
--

INSERT INTO `students` (`studentId`, `studentName`, `age`, `gender`, `phone`, `className`, `surplusClassTime`, `allClassTime`, `teacherName`, `updateDate`, `createDate`, `valid`, `school`, `grade`, `addPeople`) VALUES
(0, '学员1', 12, 0, '13632121212', 'PHP', 45, 45, '朱老师', '2021-04-01 13:37:03', '2021-03-31 14:22:12', 0, '4', 'xxx', ''),
(1, 'full', 0, 0, '13611111111', 'php', 48, 48, '张老师', '2021-04-01 10:11:22', '2019-09-02 11:55:17', 1, '', '', ''),
(2, 'pfr', 23, 1, '13611111111', 'java', 4, 48, '朱老师', '2019-09-02 12:04:25', '2019-09-02 12:04:25', 0, '', '', ''),
(3, '学员1', 12, 1, '13632121212', 'PHP', 45, 45, '朱老师', '2021-03-29 22:57:47', '2021-03-29 22:57:47', 0, '', '', ''),
(4, '学员1', 12, 1, '13632121212', 'PHP', 45, 45, '朱老师', '2021-04-01 12:03:23', '2021-03-29 22:59:55', 1, '', '', ''),
(5, '学员2', 12, 0, '13455677777', 'css', 32, 34, '张老师', '2021-04-01 13:41:37', '2021-03-30 01:47:56', 1, 'xxx', 'xxxx', ''),
(9, '葛欣灵', 13, 0, '13362928833', '少儿编程', 48, 48, '朱旭东', '2021-03-31 15:21:16', '2021-03-31 15:21:16', 1, '一小', '4', '朱旭东');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin_user`
--
ALTER TABLE `admin_user`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `menus`
--
ALTER TABLE `menus`
  ADD PRIMARY KEY (`menus_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `signIn`
--
ALTER TABLE `signIn`
  ADD PRIMARY KEY (`siId`);

--
-- Indexes for table `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`studentId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin_user`
--
ALTER TABLE `admin_user`
  MODIFY `id` int(255) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=11;
--
-- AUTO_INCREMENT for table `menus`
--
ALTER TABLE `menus`
  MODIFY `menus_id` smallint(6) unsigned NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=160;
--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=60;
--
-- AUTO_INCREMENT for table `signIn`
--
ALTER TABLE `signIn`
  MODIFY `siId` int(100) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT for table `students`
--
ALTER TABLE `students`
  MODIFY `studentId` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=10;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
