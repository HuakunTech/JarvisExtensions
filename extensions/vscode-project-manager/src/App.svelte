<script lang="ts">
  import { onMount } from "svelte";
  import "./app.css";
  import { fs, log, open } from "jarvis-api/ui";
  import { ModeWatcher } from "mode-watcher";
  import * as Command from "$lib/components/ui/command";
  import { invoke } from "@tauri-apps/api/core";
  import { z } from "zod";
  import Icon from "@iconify/svelte";

  export const Project = z.object({
    name: z.string(),
    rootPath: z.string(),
    paths: z.array(z.unknown()),
    tags: z.array(z.string()),
    enabled: z.boolean(),
  });

  let projects: z.infer<typeof Project>[] = [];

  function projectPath() {
    return "Library/Application Support/Code/User/globalStorage/alefragnani.project-manager/projects.json";
  }

  onMount(() => {
    fs.exists(projectPath(), { baseDir: fs.BaseDirectory.Home })
      .then(() =>
        fs.readTextFile(projectPath(), {
          baseDir: fs.BaseDirectory.Home,
        }),
      )
      .then((result) => {
        const parsed = Project.array().safeParse(JSON.parse(result));
        if (parsed.error) {
          log.error(`Parse VSCode Project Manager File Error error: ${parsed.error}`);
        } else {
          projects = parsed.data;
        }
      })
      .catch((err) => {
        log.error(`error: ${err}`);
      });
  });

  function onSelect(project: z.infer<typeof Project>) {
    invoke("plugin:jarvis|run_script", {
      exe: "open",
      args: [project.rootPath, "-a", "/Applications/Visual Studio Code.app"],
    });
    // open(project.rootPath, "/usr/local/bin/code");
    // open(project.rootPath, "/Applications/Visual Studio Code.app");
  }
</script>

<ModeWatcher />
<main class="h-screen flex flex-col">
  <div class="h-8" data-tauri-drag-region />
  <Command.Root on:select={() => console.log("select from root")}>
    <Command.Input placeholder="Type to search..." autofocus={true} />
    <Command.List>
      <Command.Empty>No results found.</Command.Empty>
      {#each projects as project}
        <Command.Item
          class="flex justify-between items-center text-md px-2"
          onSelect={(value) => {
            onSelect(project);
          }}
        >
          <span class="flex items-center space-x-2">
            <Icon icon="material-symbols:folder" class="inline w-5 h-5 text-blue-400" />
            <span>{project.name}</span>
          </span>
          <Command.Shortcut>
            <span>{project.rootPath}</span>
          </Command.Shortcut>
        </Command.Item>
      {/each}
    </Command.List>
  </Command.Root>
</main>
