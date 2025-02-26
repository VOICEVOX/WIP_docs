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

チーム紹介ページも作れるらしい：<https://vitepress.dev/reference/default-theme-team-page#add-sections-to-divide-team-members>
TODO。

<template v-for="section in teamSections">
  <h2>{{ section.name }}</h2>
  <VPTeamMembers size="small" :members="editAvatars(section.members)" />
</template>
