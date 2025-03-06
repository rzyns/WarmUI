// T2IModelSets["Stable-Diffusion"] = new() { ModelType = "Stable-Diffusion", FolderPaths = buildPathList(ServerSettings.Paths.SDModelFolder + ";tensorrt;diffusion_models;unet") };
// T2IModelSets["VAE"] = new() { ModelType = "VAE", FolderPaths = buildPathList(ServerSettings.Paths.SDVAEFolder) };
// T2IModelSets["LoRA"] = new() { ModelType = "LoRA", FolderPaths = buildPathList(ServerSettings.Paths.SDLoraFolder) };
// T2IModelSets["Embedding"] = new() { ModelType = "Embedding", FolderPaths = buildPathList(ServerSettings.Paths.SDEmbeddingFolder) };
// T2IModelSets["ControlNet"] = new() { ModelType = "ControlNet", FolderPaths = buildPathList(ServerSettings.Paths.SDControlNetsFolder) };
// T2IModelSets["Clip"] = new() { ModelType = "Clip", FolderPaths = buildPathList(ServerSettings.Paths.SDClipFolder) };
// T2IModelSets["ClipVision"] = new() { ModelType = "ClipVision", FolderPaths = buildPathList(ServerSettings.Paths.SDClipVisionFolder) };
import * as z from "zod";

export enum ModelTypeEnum {
    StableDiffusion = "Stable-Diffusion",
    VAE = "VAE",
    LoRA = "LoRA",
    Embedding = "Embedding",
    ControlNet = "ControlNet",
    Clip = "Clip",
    ClipVision = "ClipVision",
}

export const ModelType = z.nativeEnum(ModelTypeEnum);
export type ModelType = z.output<typeof ModelType>;
