<script setup>
import { data as teamSections } from "./team.data.ts";
import { withBase } from "vitepress";
import { VPTeamMembers } from "vitepress/theme";

const editAvatars = (members) => (
  members.map((member) => ({
    ...member,
    avatar: withBase(member.avatar),
  }))
);
</script>

# VOICEVOX チーム

現在、メンテナ 3 人とレビュワー 12 人で運営されています。
レビュワーにはPrivate設定の方もいるため、一部の方のみ掲載しています。

<template v-for="section in teamSections">
  <h2>{{ section.name }}</h2>
  <VPTeamMembers size="small" :members="editAvatars(section.members)" />
</template>
