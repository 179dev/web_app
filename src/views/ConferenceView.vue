<template>
  <!-- TeachersView -->
  <div
    v-if="conference?.userData?.role === 4"
    id="teacher-view"
  >
    <div
      v-for="editableFabricCanvas in editableFabricCanvasArray"
      :key="editableFabricCanvas.id"
      class="teacher-canvas"
    >
      <div class="canvas-id-label">
        {{ editableFabricCanvas.id }}
      </div>
      <editable-canvas-component :fabric-canvas="editableFabricCanvas" />
    </div>
    <div class="side">
      <div
        v-for="staticFabricCanvas in staticFabricCanvasArray"
        :key="staticFabricCanvas.id"
        class="student-canvas"
      >
        <div class="canvas-id-label">
          {{ staticFabricCanvas.id }}
        </div>
        <static-canvas-component :fabric-canvas="staticFabricCanvas" />
      </div>
    </div>
  </div>

  <!-- StudentsView -->
  <div
    v-else
    id="student-view"
  >
    <div
      v-for="editableFabricCanvas in editableFabricCanvasArray"
      :key="editableFabricCanvas.id"
    >
      <div class="canvas-id-label">
        {{ editableFabricCanvas.id }}
      </div>
      <editable-canvas-component :fabric-canvas="editableFabricCanvas" />
    </div>

    <div class="teacher-canvas">
      <div
        v-for="staticFabricCanvas in staticFabricCanvasArray"
        :key="staticFabricCanvas.id"
        style="width: 100%; height: 100%;"
      >
        <div class="canvas-id-label">
          {{ staticFabricCanvas.id }}
        </div>
        <static-canvas-component :fabric-canvas="staticFabricCanvas" />
      </div>
    </div>
  </div>

  <div class="navbar">
    <RouterLink to="/">
      <img
        src="@/assets/SpizdIconPack/exit.svg"
        alt="logo"
      >
    </RouterLink> <!-- home -->
    <!-- <button> -->
    <!-- <img src="@/assets/SpizdIconPack/settingsIcon.svg" alt="logo"> -->
    <!-- </button> settings -->
    <button @click="invite">
      <img
        src="@/assets/SpizdIconPack/Invite.svg"
        alt="invite"
      >
    </button> <!-- invite -->
    <!-- <button>
      <img src="@/assets/SpizdIconPack/desksIcon.svg" alt="logo">
    </button> change view -->
  </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";

import EditableCanvasComponent from "@/components/canvas/EditableCanvasComponent.vue";
import StaticCanvasComponent from "@/components/canvas/StaticCanvasComponent.vue";
import Conference, { ClientConferenceEventTypes, IClientConferenceEvent } from "@/canvasLogic/Conference";
import { FabricCanvas } from "@/canvasLogic/FabricCanvas";

export default defineComponent({
    name: "ConferenceView",
    components: {
        EditableCanvasComponent,
        StaticCanvasComponent,
    },
    data() {
        const conferenceId: string = this.$route.params["id"] as string;
        let conference: Ref<Conference | undefined> = ref();
        const staticFabricCanvasArray: Ref<FabricCanvas[]> = ref([]);
        const editableFabricCanvasArray: Ref<FabricCanvas[]> = ref([]);

        return {
            conferenceId,
            conference,
            staticFabricCanvasArray,
            editableFabricCanvasArray,
        };
    },
    mounted() {
        this.conference = new Conference(this, this.conferenceId);
    },
    unmounted() {
        this.conference?.leave();
    },
    methods: {
        createCanvas(data: IClientConferenceEvent) {
            const fabricCanvas = new FabricCanvas(data.data.id);
            if (this.conference) fabricCanvas.conference = this.conference;
            this.conference?.subscribe(fabricCanvas);
            if (data.data.id === this.conference?.userData?.id) {
                this.editableFabricCanvasArray.push(fabricCanvas);
            } else {
                this.staticFabricCanvasArray.push(fabricCanvas);
            }
        },
        update(data: IClientConferenceEvent) {
            if (data.type === ClientConferenceEventTypes.CreateCanvas) {
                this.createCanvas(data);
            }
        },
        invite() {
            navigator.clipboard.writeText("http://91.142.79.111:8080/#/conference/" + this.conferenceId);
        },
    },
});
</script>

<style scoped lang="scss">
div.canvas-id-label {
  position: relative;
  top: 8px;
  left: 8px;

  margin-bottom: -16px;

  width: fit-content;
  height: fit-content;

  font-family: monospace;
  font-weight: 100;
}

#student-view{
 .canvas-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
  } 
  .teacher-canvas {
    position: absolute;
    display: flex;
    align-items: center;
    top: 96px;
    right: 8px;
    padding: 0;
    box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);

    max-width: 33vw;
    width: 16*32px;
    aspect-ratio: 16/9;
    z-index: 1;

    border: {
      style: var(--default-border-style, solid);
      radius: var(--internal-border-radius, 8px);
      color: var(--default-border-color, var(--accent, #464AB4));
      width: var(--default-border-width, 2px);
    }
    background: var(--background, #E5E6F5);
  }
}

#teacher-view {
  width: 100%;
  height: 100%;
  .side {
    position: absolute;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 16px;
    padding-top: 96px;
    z-index: 0;
    top: 0;
    right: 0;
    width: fit-content;
    height: 100vh;
    overflow-y: scroll;
    background: var(--buttons-secondary, #D7D7EF);
    border-radius: 16px 0 0 16px;
  
    .student-canvas {
      max-width: 33vw;
      width: 16*32px;
      aspect-ratio: 16/9;
      z-index: 1;
  
      border-radius: 8px;
  
      background: var(--background, #E5E6F5);
    }
  }
  .teacher-canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: calc(67vw - 32px);
    height: 100vh;
  }
}
.navbar {
  position: absolute;
  display: flex;
  align-items: center;
  top: 16px;
  right: 48px;
  width: fit-content;
  height: 64px;

  padding: {
    left: 16px;
    right: 16px;
    top: 16px;
    bottom: 8px;
  }

  ;

  justify-content: space-between;
  gap: 16px;
  overflow: hidden;
  border-radius: 8px;
  border: 2px solid var(--accent, #464AB4);
  background: var(--background);
  box-shadow: 2px 4px 4px 0px rgba(0, 0, 0, 0.25);
  flex-shrink: 0;

  * {
    width: 48px;
    height: 48px;

    background-color: transparent;
  }

  img {
    width: 40px;
    height: 40px;
  }
}
</style>
