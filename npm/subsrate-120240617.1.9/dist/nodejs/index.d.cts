/**
 * Errors thrown by the Substrate SDK will be instances of `SubstrateError`.
 */
declare class SubstrateError extends Error {
}
declare class NodeError$1 extends SubstrateError {
    type: string;
    request_id?: string;
    message: string;
    constructor(type: string, message: string, request_id?: string);
}

interface components {
    schemas: {
        /** ErrorOut */
        ErrorOut: {
            /**
             * @description The type of error returned.
             * @enum {string}
             */
            type: "api_error" | "invalid_request_error" | "dependency_error";
            /** @description A message providing more details about the error. */
            message: string;
            /**
             * @description The HTTP status code for the error.
             * @default 500
             */
            status_code?: number;
        };
        /** ExperimentalIn */
        ExperimentalIn: {
            /** @description Identifier. */
            name: string;
            /** @description Arguments. */
            args: {
                [key: string]: unknown;
            };
            /**
             * @description Timeout in seconds.
             * @default 60
             */
            timeout?: number;
        };
        /** ExperimentalOut */
        ExperimentalOut: {
            /** @description Response. */
            output: {
                [key: string]: unknown;
            };
        };
        /** BoxIn */
        BoxIn: {
            /** @description Values to box. */
            value: unknown;
        };
        /** BoxOut */
        BoxOut: {
            /** @description The evaluated result. */
            value: unknown;
        };
        /** IfIn */
        IfIn: {
            /** @description Condition. */
            condition: boolean;
            /** @description Result when condition is true. */
            value_if_true: unknown;
            /** @description Result when condition is false. */
            value_if_false?: unknown;
        };
        /** IfOut */
        IfOut: {
            /** @description Result. Null if `value_if_false` is not provided and `condition` is false. */
            result: unknown;
        };
        /** RunPythonIn */
        RunPythonIn: {
            /** @description Pickled function. */
            pkl_function?: string;
            /** @description Keyword arguments to your function. */
            kwargs: {
                [key: string]: unknown;
            };
            /** @description Python version. */
            python_version?: string;
            /** @description Python packages to install. You must import them in your code. */
            pip_install?: string[];
        };
        /** RunPythonOut */
        RunPythonOut: {
            /** @description Return value of your function. */
            output?: unknown;
            /** @description Pickled return value. */
            pkl_output?: string;
            /** @description Everything printed to stdout while running your code. */
            stdout: string;
            /** @description Contents of stderr if your code did not run successfully. */
            stderr: string;
        };
        /** ComputeTextIn */
        ComputeTextIn: {
            /** @description Input prompt. */
            prompt: string;
            /** @description Image prompts. */
            image_uris?: string[];
            /**
             * Format: float
             * @description Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.
             * @default 0.4
             */
            temperature?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
            /**
             * @description Selected model. `Firellava13B` is automatically selected when `image_uris` is provided.
             * @default Llama3Instruct8B
             * @enum {string}
             */
            model?: "Mistral7BInstruct" | "Mixtral8x7BInstruct" | "Llama3Instruct8B" | "Llama3Instruct70B" | "Llama3Instruct405B" | "Firellava13B" | "gpt-4o" | "gpt-4o-mini" | "claude-3-5-sonnet-20240620";
        };
        /** ComputeTextOut */
        ComputeTextOut: {
            /** @description Text response. */
            text: string;
        };
        /** ComputeJSONIn */
        ComputeJSONIn: {
            /** @description Input prompt. */
            prompt: string;
            /** @description JSON schema to guide `json_object` response. */
            json_schema: {
                [key: string]: unknown;
            };
            /**
             * Format: float
             * @description Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.
             * @default 0.4
             */
            temperature?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
            /**
             * @description Selected model.
             * @default Llama3Instruct8B
             * @enum {string}
             */
            model?: "Mistral7BInstruct" | "Mixtral8x7BInstruct" | "Llama3Instruct8B";
        };
        /** ComputeJSONOut */
        ComputeJSONOut: {
            /** @description JSON response. */
            json_object?: {
                [key: string]: unknown;
            };
            /** @description If the model output could not be parsed to JSON, this is the raw text output. */
            text?: string;
        };
        /** MultiComputeTextIn */
        MultiComputeTextIn: {
            /** @description Input prompt. */
            prompt: string;
            /**
             * @description Number of choices to generate.
             * @default 1
             */
            num_choices: number;
            /**
             * Format: float
             * @description Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.
             * @default 0.4
             */
            temperature?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
            /**
             * @description Selected model.
             * @default Llama3Instruct8B
             * @enum {string}
             */
            model?: "Mistral7BInstruct" | "Mixtral8x7BInstruct" | "Llama3Instruct8B" | "Llama3Instruct70B";
        };
        /** MultiComputeTextOut */
        MultiComputeTextOut: {
            /** @description Response choices. */
            choices: {
                /** @description Text response. */
                text: string;
            }[];
        };
        /** BatchComputeTextIn */
        BatchComputeTextIn: {
            /** @description Batch input prompts. */
            prompts: string[];
            /**
             * Format: float
             * @description Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.
             * @default 0.4
             */
            temperature?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
            /**
             * @description Selected model.
             * @default Llama3Instruct8B
             * @enum {string}
             */
            model?: "Mistral7BInstruct" | "Llama3Instruct8B";
        };
        /** BatchComputeTextOut */
        BatchComputeTextOut: {
            /** @description Batch outputs. */
            outputs: {
                /** @description Text response. */
                text: string;
            }[];
        };
        /** MultiComputeJSONIn */
        MultiComputeJSONIn: {
            /** @description Input prompt. */
            prompt: string;
            /** @description JSON schema to guide `json_object` response. */
            json_schema: {
                [key: string]: unknown;
            };
            /**
             * @description Number of choices to generate.
             * @default 2
             */
            num_choices: number;
            /**
             * Format: float
             * @description Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.
             * @default 0.4
             */
            temperature?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
            /**
             * @description Selected model.
             * @default Llama3Instruct8B
             * @enum {string}
             */
            model?: "Mistral7BInstruct" | "Mixtral8x7BInstruct" | "Llama3Instruct8B";
        };
        /** MultiComputeJSONOut */
        MultiComputeJSONOut: {
            /** @description Response choices. */
            choices: {
                /** @description JSON response. */
                json_object?: {
                    [key: string]: unknown;
                };
                /** @description If the model output could not be parsed to JSON, this is the raw text output. */
                text?: string;
            }[];
        };
        /** BatchComputeJSONIn */
        BatchComputeJSONIn: {
            /** @description Batch input prompts. */
            prompts: string[];
            /** @description JSON schema to guide `json_object` response. */
            json_schema: {
                [key: string]: unknown;
            };
            /**
             * Format: float
             * @description Sampling temperature to use. Higher values make the output more random, lower values make the output more deterministic.
             * @default 0.4
             */
            temperature?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
            /**
             * @description Selected model.
             * @default Llama3Instruct8B
             * @enum {string}
             */
            model?: "Mistral7BInstruct" | "Llama3Instruct8B";
        };
        /** BatchComputeJSONOut */
        BatchComputeJSONOut: {
            /** @description Batch outputs. */
            outputs: {
                /** @description JSON response. */
                json_object?: {
                    [key: string]: unknown;
                };
                /** @description If the model output could not be parsed to JSON, this is the raw text output. */
                text?: string;
            }[];
        };
        /** Mistral7BInstructIn */
        Mistral7BInstructIn: {
            /** @description Input prompt. */
            prompt: string;
            /** @description System prompt. */
            system_prompt?: string;
            /**
             * @description Number of choices to generate.
             * @default 1
             */
            num_choices?: number;
            /** @description JSON schema to guide response. */
            json_schema?: {
                [key: string]: unknown;
            };
            /**
             * Format: float
             * @description Higher values make the output more random, lower values make the output more deterministic.
             */
            temperature?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeating previous tokens.
             * @default 0
             */
            frequency_penalty?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeated sequences.
             * @default 1
             */
            repetition_penalty?: number;
            /**
             * Format: float
             * @description Higher values increase the likelihood of new topics appearing.
             * @default 1.1
             */
            presence_penalty?: number;
            /**
             * Format: float
             * @description Probability below which less likely tokens are filtered out.
             * @default 0.95
             */
            top_p?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
        };
        /** Mistral7BInstructChoice */
        Mistral7BInstructChoice: {
            /** @description Text response, if `json_schema` was not provided. */
            text?: string;
            /** @description JSON response, if `json_schema` was provided. */
            json_object?: {
                [key: string]: unknown;
            };
        };
        /** Mistral7BInstructOut */
        Mistral7BInstructOut: {
            /** @description Response choices. */
            choices: {
                /** @description Text response, if `json_schema` was not provided. */
                text?: string;
                /** @description JSON response, if `json_schema` was provided. */
                json_object?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** Mixtral8x7BInstructIn */
        Mixtral8x7BInstructIn: {
            /** @description Input prompt. */
            prompt: string;
            /** @description System prompt. */
            system_prompt?: string;
            /**
             * @description Number of choices to generate.
             * @default 1
             */
            num_choices?: number;
            /** @description JSON schema to guide response. */
            json_schema?: {
                [key: string]: unknown;
            };
            /**
             * Format: float
             * @description Higher values make the output more random, lower values make the output more deterministic.
             */
            temperature?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeating previous tokens.
             * @default 0
             */
            frequency_penalty?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeated sequences.
             * @default 1
             */
            repetition_penalty?: number;
            /**
             * Format: float
             * @description Higher values increase the likelihood of new topics appearing.
             * @default 1.1
             */
            presence_penalty?: number;
            /**
             * Format: float
             * @description Probability below which less likely tokens are filtered out.
             * @default 0.95
             */
            top_p?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
        };
        /** Mixtral8x7BChoice */
        Mixtral8x7BChoice: {
            /** @description Text response, if `json_schema` was not provided. */
            text?: string;
            /** @description JSON response, if `json_schema` was provided. */
            json_object?: {
                [key: string]: unknown;
            };
        };
        /** Mixtral8x7BInstructOut */
        Mixtral8x7BInstructOut: {
            /** @description Response choices. */
            choices: {
                /** @description Text response, if `json_schema` was not provided. */
                text?: string;
                /** @description JSON response, if `json_schema` was provided. */
                json_object?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** Llama3Instruct8BIn */
        Llama3Instruct8BIn: {
            /** @description Input prompt. */
            prompt: string;
            /** @description System prompt. */
            system_prompt?: string;
            /**
             * @description Number of choices to generate.
             * @default 1
             */
            num_choices?: number;
            /**
             * Format: float
             * @description Higher values make the output more random, lower values make the output more deterministic.
             */
            temperature?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeating previous tokens.
             * @default 0
             */
            frequency_penalty?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeated sequences.
             * @default 1
             */
            repetition_penalty?: number;
            /**
             * Format: float
             * @description Higher values increase the likelihood of new topics appearing.
             * @default 1.1
             */
            presence_penalty?: number;
            /**
             * Format: float
             * @description Probability below which less likely tokens are filtered out.
             * @default 0.95
             */
            top_p?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
            /** @description JSON schema to guide response. */
            json_schema?: {
                [key: string]: unknown;
            };
        };
        /** Llama3Instruct8BChoice */
        Llama3Instruct8BChoice: {
            /** @description Text response. */
            text?: string;
            /** @description JSON response, if `json_schema` was provided. */
            json_object?: {
                [key: string]: unknown;
            };
        };
        /** Llama3Instruct8BOut */
        Llama3Instruct8BOut: {
            /** @description Response choices. */
            choices: {
                /** @description Text response. */
                text?: string;
                /** @description JSON response, if `json_schema` was provided. */
                json_object?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** Llama3Instruct70BIn */
        Llama3Instruct70BIn: {
            /** @description Input prompt. */
            prompt: string;
            /** @description System prompt. */
            system_prompt?: string;
            /**
             * @description Number of choices to generate.
             * @default 1
             */
            num_choices?: number;
            /**
             * Format: float
             * @description Higher values make the output more random, lower values make the output more deterministic.
             */
            temperature?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeating previous tokens.
             * @default 0
             */
            frequency_penalty?: number;
            /**
             * Format: float
             * @description Higher values decrease the likelihood of repeated sequences.
             * @default 1
             */
            repetition_penalty?: number;
            /**
             * Format: float
             * @description Higher values increase the likelihood of new topics appearing.
             * @default 1.1
             */
            presence_penalty?: number;
            /**
             * Format: float
             * @description Probability below which less likely tokens are filtered out.
             * @default 0.95
             */
            top_p?: number;
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
        };
        /** Llama3Instruct70BChoice */
        Llama3Instruct70BChoice: {
            /** @description Text response. */
            text?: string;
        };
        /** Llama3Instruct70BOut */
        Llama3Instruct70BOut: {
            /** @description Response choices. */
            choices: {
                /** @description Text response. */
                text?: string;
            }[];
        };
        /** Firellava13BIn */
        Firellava13BIn: {
            /** @description Text prompt. */
            prompt: string;
            /** @description Image prompts. */
            image_uris: string[];
            /** @description Maximum number of tokens to generate. */
            max_tokens?: number;
        };
        /** Firellava13BOut */
        Firellava13BOut: {
            /** @description Text response. */
            text: string;
        };
        /** GenerateImageIn */
        GenerateImageIn: {
            /** @description Text prompt. */
            prompt: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** GenerateImageOut */
        GenerateImageOut: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
        };
        /** MultiGenerateImageIn */
        MultiGenerateImageIn: {
            /** @description Text prompt. */
            prompt: string;
            /**
             * @description Number of images to generate.
             * @default 2
             */
            num_images: number;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** MultiGenerateImageOut */
        MultiGenerateImageOut: {
            /** @description Generated images. */
            outputs: {
                /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
                image_uri: string;
            }[];
        };
        /** StableDiffusionXLIn */
        StableDiffusionXLIn: {
            /** @description Text prompt. */
            prompt: string;
            /** @description Negative input prompt. */
            negative_prompt?: string;
            /**
             * @description Number of diffusion steps.
             * @default 30
             */
            steps?: number;
            /**
             * @description Number of images to generate.
             * @default 1
             */
            num_images: number;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
            /**
             * @description Height of output image, in pixels.
             * @default 1024
             */
            height?: number;
            /**
             * @description Width of output image, in pixels.
             * @default 1024
             */
            width?: number;
            /** @description Seeds for deterministic generation. Default is a random seed. */
            seeds?: number[];
            /**
             * Format: float
             * @description Higher values adhere to the text prompt more strongly, typically at the expense of image quality.
             * @default 7
             */
            guidance_scale?: number;
        };
        /** StableDiffusionImage */
        StableDiffusionImage: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
            /** @description The random noise seed used for generation. */
            seed: number;
        };
        /** StableDiffusionXLOut */
        StableDiffusionXLOut: {
            /** @description Generated images. */
            outputs: {
                /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
                image_uri: string;
                /** @description The random noise seed used for generation. */
                seed: number;
            }[];
        };
        /** StableDiffusionXLLightningIn */
        StableDiffusionXLLightningIn: {
            /** @description Text prompt. */
            prompt: string;
            /** @description Negative input prompt. */
            negative_prompt?: string;
            /**
             * @description Number of images to generate.
             * @default 1
             */
            num_images?: number;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
            /**
             * @description Height of output image, in pixels.
             * @default 1024
             */
            height?: number;
            /**
             * @description Width of output image, in pixels.
             * @default 1024
             */
            width?: number;
            /** @description Seeds for deterministic generation. Default is a random seed. */
            seeds?: number[];
        };
        /** StableDiffusionXLLightningOut */
        StableDiffusionXLLightningOut: {
            /** @description Generated images. */
            outputs: {
                /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
                image_uri: string;
                /** @description The random noise seed used for generation. */
                seed: number;
            }[];
        };
        /** StableDiffusionXLIPAdapterIn */
        StableDiffusionXLIPAdapterIn: {
            /** @description Text prompt. */
            prompt: string;
            /** @description Image prompt. */
            image_prompt_uri: string;
            /**
             * @description Number of images to generate.
             * @default 1
             */
            num_images: number;
            /**
             * Format: float
             * @description Controls the influence of the image prompt on the generated output.
             * @default 0.5
             */
            ip_adapter_scale?: number;
            /** @description Negative input prompt. */
            negative_prompt?: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
            /**
             * @description Width of output image, in pixels.
             * @default 1024
             */
            width?: number;
            /**
             * @description Height of output image, in pixels.
             * @default 1024
             */
            height?: number;
            /** @description Random noise seeds. Default is random seeds for each generation. */
            seeds?: number[];
        };
        /** StableDiffusionXLIPAdapterOut */
        StableDiffusionXLIPAdapterOut: {
            /** @description Generated images. */
            outputs: {
                /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
                image_uri: string;
                /** @description The random noise seed used for generation. */
                seed: number;
            }[];
        };
        /** StableDiffusionXLControlNetIn */
        StableDiffusionXLControlNetIn: {
            /** @description Input image. */
            image_uri: string;
            /**
             * @description Strategy to control generation using the input image.
             * @enum {string}
             */
            control_method: "edge" | "depth" | "illusion" | "tile";
            /** @description Text prompt. */
            prompt: string;
            /**
             * @description Number of images to generate.
             * @default 1
             */
            num_images: number;
            /**
             * @description Resolution of the output image, in pixels.
             * @default 1024
             */
            output_resolution?: number;
            /** @description Negative input prompt. */
            negative_prompt?: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
            /**
             * Format: float
             * @description Controls the influence of the input image on the generated output.
             * @default 0.5
             */
            conditioning_scale?: number;
            /**
             * Format: float
             * @description Controls how much to transform the input image.
             * @default 0.5
             */
            strength?: number;
            /** @description Random noise seeds. Default is random seeds for each generation. */
            seeds?: number[];
        };
        /** StableDiffusionXLControlNetOut */
        StableDiffusionXLControlNetOut: {
            /** @description Generated images. */
            outputs: {
                /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
                image_uri: string;
                /** @description The random noise seed used for generation. */
                seed: number;
            }[];
        };
        /** StableVideoDiffusionIn */
        StableVideoDiffusionIn: {
            /** @description Original image. */
            image_uri: string;
            /** @description Use "hosted" to return a video URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the video data will be returned as a base64-encoded string. */
            store?: string;
            /**
             * @description Output video format.
             * @default gif
             * @enum {string}
             */
            output_format?: "gif" | "webp" | "mp4" | "frames";
            /** @description Seed for deterministic generation. Default is a random seed. */
            seed?: number;
            /**
             * @description Frames per second of the generated video. Ignored if output format is `frames`.
             * @default 7
             */
            fps?: number;
            /**
             * @description The motion bucket id to use for the generated video. This can be used to control the motion of the generated video. Increasing the motion bucket id increases the motion of the generated video.
             * @default 180
             */
            motion_bucket_id?: number;
            /**
             * Format: float
             * @description The amount of noise added to the conditioning image. The higher the values the less the video resembles the conditioning image. Increasing this value also increases the motion of the generated video.
             * @default 0.1
             */
            noise?: number;
        };
        /** StableVideoDiffusionOut */
        StableVideoDiffusionOut: {
            /** @description Generated video. */
            video_uri?: string;
            /** @description Generated frames. */
            frame_uris?: string[];
        };
        /** InterpolateFramesIn */
        InterpolateFramesIn: {
            /** @description Frames. */
            frame_uris: string[];
            /** @description Use "hosted" to return a video URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the video data will be returned as a base64-encoded string. */
            store?: string;
            /**
             * @description Output video format.
             * @default gif
             * @enum {string}
             */
            output_format?: "gif" | "webp" | "mp4" | "frames";
            /**
             * @description Frames per second of the generated video. Ignored if output format is `frames`.
             * @default 7
             */
            fps?: number;
            /**
             * @description Number of interpolation steps. Each step adds an interpolated frame between adjacent frames. For example, 2 steps over 2 frames produces 5 frames.
             * @default 2
             */
            num_steps?: number;
        };
        /** InterpolateFramesOut */
        InterpolateFramesOut: {
            /** @description Generated video. */
            video_uri?: string;
            /** @description Output frames. */
            frame_uris?: string[];
        };
        /** InpaintImageIn */
        InpaintImageIn: {
            /** @description Original image. */
            image_uri: string;
            /** @description Text prompt. */
            prompt: string;
            /** @description Mask image that controls which pixels are inpainted. If unset, the entire image is edited (image-to-image). */
            mask_image_uri?: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** InpaintImageOut */
        InpaintImageOut: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
        };
        /** MultiInpaintImageIn */
        MultiInpaintImageIn: {
            /** @description Original image. */
            image_uri: string;
            /** @description Text prompt. */
            prompt: string;
            /** @description Mask image that controls which pixels are edited (inpainting). If unset, the entire image is edited (image-to-image). */
            mask_image_uri?: string;
            /**
             * @description Number of images to generate.
             * @default 2
             */
            num_images: number;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** MultiInpaintImageOut */
        MultiInpaintImageOut: {
            /** @description Generated images. */
            outputs: {
                /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
                image_uri: string;
            }[];
        };
        /** StableDiffusionXLInpaintIn */
        StableDiffusionXLInpaintIn: {
            /** @description Original image. */
            image_uri: string;
            /** @description Text prompt. */
            prompt: string;
            /** @description Mask image that controls which pixels are edited (inpainting). If unset, the entire image is edited (image-to-image). */
            mask_image_uri?: string;
            /**
             * @description Number of images to generate.
             * @default 1
             */
            num_images: number;
            /**
             * @description Resolution of the output image, in pixels.
             * @default 1024
             */
            output_resolution?: number;
            /** @description Negative input prompt. */
            negative_prompt?: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
            /**
             * Format: float
             * @description Controls the strength of the generation process.
             * @default 0.8
             */
            strength?: number;
            /** @description Random noise seeds. Default is random seeds for each generation. */
            seeds?: number[];
        };
        /** StableDiffusionXLInpaintOut */
        StableDiffusionXLInpaintOut: {
            /** @description Generated images. */
            outputs: {
                /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
                image_uri: string;
                /** @description The random noise seed used for generation. */
                seed: number;
            }[];
        };
        /** BoundingBox */
        BoundingBox: {
            /**
             * Format: float
             * @description Top left corner x.
             */
            x1: number;
            /**
             * Format: float
             * @description Top left corner y.
             */
            y1: number;
            /**
             * Format: float
             * @description Bottom right corner x.
             */
            x2: number;
            /**
             * Format: float
             * @description Bottom right corner y.
             */
            y2: number;
        };
        /** Point */
        Point: {
            /** @description X position. */
            x: number;
            /** @description Y position. */
            y: number;
        };
        /** EraseImageIn */
        EraseImageIn: {
            /** @description Input image. */
            image_uri: string;
            /** @description Mask image that controls which pixels are inpainted. */
            mask_image_uri: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** EraseImageOut */
        EraseImageOut: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
        };
        /** BigLaMaIn */
        BigLaMaIn: {
            /** @description Input image. */
            image_uri: string;
            /** @description Mask image that controls which pixels are inpainted. */
            mask_image_uri: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** BigLaMaOut */
        BigLaMaOut: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
        };
        /** RemoveBackgroundIn */
        RemoveBackgroundIn: {
            /** @description Input image. */
            image_uri: string;
            /**
             * @description Return a mask image instead of the original content.
             * @default false
             */
            return_mask?: boolean;
            /**
             * @description Invert the mask image. Only takes effect if `return_mask` is true.
             * @default false
             */
            invert_mask?: boolean;
            /** @description Hex value background color. Transparent if unset. */
            background_color?: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** RemoveBackgroundOut */
        RemoveBackgroundOut: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
        };
        /** DISISNetIn */
        DISISNetIn: {
            /** @description Input image. */
            image_uri: string;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** DISISNetOut */
        DISISNetOut: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
        };
        /** UpscaleImageIn */
        UpscaleImageIn: {
            /** @description Prompt to guide model on the content of image to upscale. */
            prompt?: string;
            /** @description Input image. */
            image_uri: string;
            /**
             * @description Resolution of the output image, in pixels.
             * @default 1024
             */
            output_resolution?: number;
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** UpscaleImageOut */
        UpscaleImageOut: {
            /** @description Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            image_uri: string;
        };
        /** SegmentUnderPointIn */
        SegmentUnderPointIn: {
            /** @description Input image. */
            image_uri: string;
            /** Point */
            point: {
                /** @description X position. */
                x: number;
                /** @description Y position. */
                y: number;
            };
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** SegmentUnderPointOut */
        SegmentUnderPointOut: {
            /** @description Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            mask_image_uri: string;
        };
        /** SegmentAnythingIn */
        SegmentAnythingIn: {
            /** @description Input image. */
            image_uri: string;
            /** @description Point prompts, to detect a segment under the point. One of `point_prompts` or `box_prompts` must be set. */
            point_prompts?: {
                /** @description X position. */
                x: number;
                /** @description Y position. */
                y: number;
            }[];
            /** @description Box prompts, to detect a segment within the bounding box. One of `point_prompts` or `box_prompts` must be set. */
            box_prompts?: {
                /**
                 * Format: float
                 * @description Top left corner x.
                 */
                x1: number;
                /**
                 * Format: float
                 * @description Top left corner y.
                 */
                y1: number;
                /**
                 * Format: float
                 * @description Bottom right corner x.
                 */
                x2: number;
                /**
                 * Format: float
                 * @description Bottom right corner y.
                 */
                y2: number;
            }[];
            /** @description Use "hosted" to return an image URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the image data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** SegmentAnythingOut */
        SegmentAnythingOut: {
            /** @description Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
            mask_image_uri: string;
        };
        /** TranscribeSpeechIn */
        TranscribeSpeechIn: {
            /** @description Input audio. */
            audio_uri: string;
            /** @description Prompt to guide model on the content and context of input audio. */
            prompt?: string;
            /**
             * @description Language of input audio in [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) format.
             * @default en
             */
            language?: string;
            /**
             * @description Segment the text into sentences with approximate timestamps.
             * @default false
             */
            segment?: boolean;
            /**
             * @description Align transcription to produce more accurate sentence-level timestamps and word-level timestamps. An array of word segments will be included in each sentence segment.
             * @default false
             */
            align?: boolean;
            /**
             * @description Identify speakers for each segment. Speaker IDs will be included in each segment.
             * @default false
             */
            diarize?: boolean;
            /**
             * @description Suggest automatic chapter markers.
             * @default false
             */
            suggest_chapters?: boolean;
        };
        /** TranscribedWord */
        TranscribedWord: {
            /** @description Text of word. */
            word: string;
            /**
             * Format: float
             * @description Start time of word, in seconds.
             */
            start?: number;
            /**
             * Format: float
             * @description End time of word, in seconds.
             */
            end?: number;
            /** @description ID of speaker, if `diarize` is enabled. */
            speaker?: string;
        };
        /** TranscribedSegment */
        TranscribedSegment: {
            /** @description Text of segment. */
            text: string;
            /**
             * Format: float
             * @description Start time of segment, in seconds.
             */
            start: number;
            /**
             * Format: float
             * @description End time of segment, in seconds.
             */
            end: number;
            /** @description ID of speaker, if `diarize` is enabled. */
            speaker?: string;
            /** @description Aligned words, if `align` is enabled. */
            words?: {
                /** @description Text of word. */
                word: string;
                /**
                 * Format: float
                 * @description Start time of word, in seconds.
                 */
                start?: number;
                /**
                 * Format: float
                 * @description End time of word, in seconds.
                 */
                end?: number;
                /** @description ID of speaker, if `diarize` is enabled. */
                speaker?: string;
            }[];
        };
        /** ChapterMarker */
        ChapterMarker: {
            /** @description Chapter title. */
            title: string;
            /**
             * Format: float
             * @description Start time of chapter, in seconds.
             */
            start: number;
        };
        /** TranscribeSpeechOut */
        TranscribeSpeechOut: {
            /** @description Transcribed text. */
            text: string;
            /** @description Transcribed segments, if `segment` is enabled. */
            segments?: {
                /** @description Text of segment. */
                text: string;
                /**
                 * Format: float
                 * @description Start time of segment, in seconds.
                 */
                start: number;
                /**
                 * Format: float
                 * @description End time of segment, in seconds.
                 */
                end: number;
                /** @description ID of speaker, if `diarize` is enabled. */
                speaker?: string;
                /** @description Aligned words, if `align` is enabled. */
                words?: {
                    /** @description Text of word. */
                    word: string;
                    /**
                     * Format: float
                     * @description Start time of word, in seconds.
                     */
                    start?: number;
                    /**
                     * Format: float
                     * @description End time of word, in seconds.
                     */
                    end?: number;
                    /** @description ID of speaker, if `diarize` is enabled. */
                    speaker?: string;
                }[];
            }[];
            /** @description Chapter markers, if `suggest_chapters` is enabled. */
            chapters?: {
                /** @description Chapter title. */
                title: string;
                /**
                 * Format: float
                 * @description Start time of chapter, in seconds.
                 */
                start: number;
            }[];
        };
        /** GenerateSpeechIn */
        GenerateSpeechIn: {
            /** @description Input text. */
            text: string;
            /** @description Use "hosted" to return an audio URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the audio data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** GenerateSpeechOut */
        GenerateSpeechOut: {
            /** @description Base 64-encoded WAV audio bytes, or a hosted audio url if `store` is provided. */
            audio_uri: string;
        };
        /** XTTSV2In */
        XTTSV2In: {
            /** @description Input text. */
            text: string;
            /** @description Reference audio used to synthesize the speaker. If unset, a default speaker voice will be used. */
            audio_uri?: string;
            /**
             * @description Language of input text. Supported languages: `en, de, fr, es, it, pt, pl, zh, ar, cs, ru, nl, tr, hu, ko`.
             * @default en
             */
            language?: string;
            /** @description Use "hosted" to return an audio URL hosted on Substrate. You can also provide a URL to a registered [file store](https://docs.substrate.run/reference/external-files). If unset, the audio data will be returned as a base64-encoded string. */
            store?: string;
        };
        /** XTTSV2Out */
        XTTSV2Out: {
            /** @description Base 64-encoded WAV audio bytes, or a hosted audio url if `store` is provided. */
            audio_uri: string;
        };
        /** Embedding */
        Embedding: {
            /** @description Embedding vector. */
            vector: number[];
            /** @description Vector store document ID. */
            doc_id?: string;
            /** @description Vector store document metadata. */
            metadata?: {
                [key: string]: unknown;
            };
        };
        /** EmbedTextIn */
        EmbedTextIn: {
            /** @description Text to embed. */
            text: string;
            /** @description Vector store name. */
            collection_name?: string;
            /** @description Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
            metadata?: {
                [key: string]: unknown;
            };
            /** @description Choose keys from `metadata` to embed with text. */
            embedded_metadata_keys?: string[];
            /** @description Vector store document ID. Ignored if `store` is unset. */
            doc_id?: string;
            /**
             * @description Selected embedding model.
             * @default jina-v2
             * @enum {string}
             */
            model?: "jina-v2" | "clip";
        };
        /** EmbedTextOut */
        EmbedTextOut: {
            /** Embedding */
            embedding: {
                /** @description Embedding vector. */
                vector: number[];
                /** @description Vector store document ID. */
                doc_id?: string;
                /** @description Vector store document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            };
        };
        /** EmbedTextItem */
        EmbedTextItem: {
            /** @description Text to embed. */
            text: string;
            /** @description Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
            metadata?: {
                [key: string]: unknown;
            };
            /** @description Vector store document ID. Ignored if `collection_name` is unset. */
            doc_id?: string;
        };
        /** MultiEmbedTextIn */
        MultiEmbedTextIn: {
            /** @description Items to embed. */
            items: {
                /** @description Text to embed. */
                text: string;
                /** @description Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
                metadata?: {
                    [key: string]: unknown;
                };
                /** @description Vector store document ID. Ignored if `collection_name` is unset. */
                doc_id?: string;
            }[];
            /** @description Vector store name. */
            collection_name?: string;
            /** @description Choose keys from `metadata` to embed with text. */
            embedded_metadata_keys?: string[];
            /**
             * @description Selected embedding model.
             * @default jina-v2
             * @enum {string}
             */
            model?: "jina-v2" | "clip";
        };
        /** MultiEmbedTextOut */
        MultiEmbedTextOut: {
            /** @description Generated embeddings. */
            embeddings: {
                /** @description Embedding vector. */
                vector: number[];
                /** @description Vector store document ID. */
                doc_id?: string;
                /** @description Vector store document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** JinaV2In */
        JinaV2In: {
            /** @description Items to embed. */
            items: {
                /** @description Text to embed. */
                text: string;
                /** @description Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
                metadata?: {
                    [key: string]: unknown;
                };
                /** @description Vector store document ID. Ignored if `collection_name` is unset. */
                doc_id?: string;
            }[];
            /** @description Vector store name. */
            collection_name?: string;
            /** @description Choose keys from `metadata` to embed with text. */
            embedded_metadata_keys?: string[];
        };
        /** JinaV2Out */
        JinaV2Out: {
            /** @description Generated embeddings. */
            embeddings: {
                /** @description Embedding vector. */
                vector: number[];
                /** @description Vector store document ID. */
                doc_id?: string;
                /** @description Vector store document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** EmbedImageIn */
        EmbedImageIn: {
            /** @description Image to embed. */
            image_uri: string;
            /** @description Vector store name. */
            collection_name?: string;
            /** @description Vector store document ID. Ignored if `collection_name` is unset. */
            doc_id?: string;
            /**
             * @description Selected embedding model.
             * @default clip
             * @enum {string}
             */
            model?: "clip";
        };
        /** EmbedImageOut */
        EmbedImageOut: {
            /** Embedding */
            embedding: {
                /** @description Embedding vector. */
                vector: number[];
                /** @description Vector store document ID. */
                doc_id?: string;
                /** @description Vector store document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            };
        };
        /** EmbedImageItem */
        EmbedImageItem: {
            /** @description Image to embed. */
            image_uri: string;
            /** @description Vector store document ID. Ignored if `collection_name` is unset. */
            doc_id?: string;
        };
        /** EmbedTextOrImageItem */
        EmbedTextOrImageItem: {
            /** @description Image to embed. */
            image_uri?: string;
            /** @description Text to embed. */
            text?: string;
            /** @description Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
            metadata?: {
                [key: string]: unknown;
            };
            /** @description Vector store document ID. Ignored if `collection_name` is unset. */
            doc_id?: string;
        };
        /** MultiEmbedImageIn */
        MultiEmbedImageIn: {
            /** @description Items to embed. */
            items: {
                /** @description Image to embed. */
                image_uri: string;
                /** @description Vector store document ID. Ignored if `collection_name` is unset. */
                doc_id?: string;
            }[];
            /** @description Vector store name. */
            collection_name?: string;
            /**
             * @description Selected embedding model.
             * @default clip
             * @enum {string}
             */
            model?: "clip";
        };
        /** MultiEmbedImageOut */
        MultiEmbedImageOut: {
            /** @description Generated embeddings. */
            embeddings: {
                /** @description Embedding vector. */
                vector: number[];
                /** @description Vector store document ID. */
                doc_id?: string;
                /** @description Vector store document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** CLIPIn */
        CLIPIn: {
            /** @description Items to embed. */
            items: {
                /** @description Image to embed. */
                image_uri?: string;
                /** @description Text to embed. */
                text?: string;
                /** @description Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
                metadata?: {
                    [key: string]: unknown;
                };
                /** @description Vector store document ID. Ignored if `collection_name` is unset. */
                doc_id?: string;
            }[];
            /** @description Vector store name. */
            collection_name?: string;
            /** @description Choose keys from `metadata` to embed with text. Only applies to text items. */
            embedded_metadata_keys?: string[];
        };
        /** CLIPOut */
        CLIPOut: {
            /** @description Generated embeddings. */
            embeddings: {
                /** @description Embedding vector. */
                vector: number[];
                /** @description Vector store document ID. */
                doc_id?: string;
                /** @description Vector store document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** FindOrCreateVectorStoreIn */
        FindOrCreateVectorStoreIn: {
            /** @description Vector store name. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
        };
        /** FindOrCreateVectorStoreOut */
        FindOrCreateVectorStoreOut: {
            /** @description Vector store name. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
            /** @description Number of leaves in the vector store. */
            num_leaves?: number;
        };
        /** ListVectorStoresIn */
        ListVectorStoresIn: Record<string, never>;
        /** ListVectorStoresOut */
        ListVectorStoresOut: {
            /** @description List of vector stores. */
            items?: {
                /** @description Vector store name. */
                collection_name: string;
                /**
                 * @description Selected embedding model.
                 * @enum {string}
                 */
                model: "jina-v2" | "clip";
                /** @description Number of leaves in the vector store. */
                num_leaves?: number;
            }[];
        };
        /** DeleteVectorStoreIn */
        DeleteVectorStoreIn: {
            /** @description Vector store name. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
        };
        /** DeleteVectorStoreOut */
        DeleteVectorStoreOut: {
            /** @description Vector store name. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
        };
        /**
         * Vector
         * @description Canonical representation of document with embedding vector.
         */
        Vector: {
            /** @description Document ID. */
            id: string;
            /** @description Embedding vector. */
            vector: number[];
            /** @description Document metadata. */
            metadata: {
                [key: string]: unknown;
            };
        };
        /** FetchVectorsIn */
        FetchVectorsIn: {
            /** @description Vector store name. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
            /** @description Document IDs to retrieve. */
            ids: string[];
        };
        /** FetchVectorsOut */
        FetchVectorsOut: {
            /** @description Retrieved vectors. */
            vectors: {
                /** @description Document ID. */
                id: string;
                /** @description Embedding vector. */
                vector: number[];
                /** @description Document metadata. */
                metadata: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** UpdateVectorsOut */
        UpdateVectorsOut: {
            /** @description Number of vectors modified. */
            count: number;
        };
        /** DeleteVectorsOut */
        DeleteVectorsOut: {
            /** @description Number of vectors modified. */
            count: number;
        };
        /** UpdateVectorParams */
        UpdateVectorParams: {
            /** @description Document ID. */
            id: string;
            /** @description Embedding vector. */
            vector?: number[];
            /** @description Document metadata. */
            metadata?: {
                [key: string]: unknown;
            };
        };
        /** UpdateVectorsIn */
        UpdateVectorsIn: {
            /** @description Vector store name. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
            /** @description Vectors to upsert. */
            vectors: {
                /** @description Document ID. */
                id: string;
                /** @description Embedding vector. */
                vector?: number[];
                /** @description Document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            }[];
        };
        /** DeleteVectorsIn */
        DeleteVectorsIn: {
            /** @description Vector store name. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
            /** @description Document IDs to delete. */
            ids: string[];
        };
        /** QueryVectorStoreIn */
        QueryVectorStoreIn: {
            /** @description Vector store to query against. */
            collection_name: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model: "jina-v2" | "clip";
            /** @description Texts to embed and use for the query. */
            query_strings?: string[];
            /** @description Image URIs to embed and use for the query. */
            query_image_uris?: string[];
            /** @description Vectors to use for the query. */
            query_vectors?: number[][];
            /** @description Document IDs to use for the query. */
            query_ids?: string[];
            /**
             * @description Number of results to return.
             * @default 10
             */
            top_k?: number;
            /**
             * @description The size of the dynamic candidate list for searching the index graph.
             * @default 40
             */
            ef_search?: number;
            /**
             * @description The number of leaves in the index tree to search.
             * @default 40
             */
            num_leaves_to_search?: number;
            /**
             * @description Include the values of the vectors in the response.
             * @default false
             */
            include_values?: boolean;
            /**
             * @description Include the metadata of the vectors in the response.
             * @default false
             */
            include_metadata?: boolean;
            /** @description Filter metadata by key-value pairs. */
            filters?: {
                [key: string]: unknown;
            };
        };
        /** VectorStoreQueryResult */
        VectorStoreQueryResult: {
            /** @description Document ID. */
            id: string;
            /**
             * Format: float
             * @description Similarity score.
             */
            distance: number;
            /** @description Embedding vector. */
            vector?: number[];
            /** @description Document metadata. */
            metadata?: {
                [key: string]: unknown;
            };
        };
        /** QueryVectorStoreOut */
        QueryVectorStoreOut: {
            /** @description Query results. */
            results: {
                /** @description Document ID. */
                id: string;
                /**
                 * Format: float
                 * @description Similarity score.
                 */
                distance: number;
                /** @description Embedding vector. */
                vector?: number[];
                /** @description Document metadata. */
                metadata?: {
                    [key: string]: unknown;
                };
            }[][];
            /** @description Vector store name. */
            collection_name?: string;
            /**
             * @description Selected embedding model.
             * @enum {string}
             */
            model?: "jina-v2" | "clip";
        };
        /** SplitDocumentIn */
        SplitDocumentIn: {
            /** @description URI of the document. */
            uri: string;
            /** @description Document ID. */
            doc_id?: string;
            /** @description Document metadata. */
            metadata?: {
                [key: string]: unknown;
            };
            /** @description Maximum number of units per chunk. Defaults to 1024 tokens for text or 40 lines for code. */
            chunk_size?: number;
            /** @description Number of units to overlap between chunks. Defaults to 200 tokens for text or 15 lines for code. */
            chunk_overlap?: number;
        };
        /** SplitDocumentOut */
        SplitDocumentOut: {
            /** @description Document chunks */
            items: {
                /** @description Text to embed. */
                text: string;
                /** @description Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
                metadata?: {
                    [key: string]: unknown;
                };
                /** @description Vector store document ID. Ignored if `collection_name` is unset. */
                doc_id?: string;
            }[];
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}

type JQCompatible = Record<string, unknown> | any[] | string | number;
type JQDirectiveTarget = Future<any> | JQCompatible;
type FutureTypeMap = {
    string: FutureString;
    object: FutureAnyObject;
    number: FutureNumber;
    boolean: FutureBoolean;
};
declare abstract class Directive {
    abstract items: any[];
    abstract next(...args: any[]): Directive;
    abstract toJSON(): any;
    abstract result(): Promise<any>;
    referencedFutures(): Future<any>[];
}
declare abstract class Future<T> {
    protected _directive: Directive;
    protected _id: string;
    constructor(directive: Directive, id?: string);
    protected referencedFutures(): Future<any>[];
    protected toPlaceholder(): {
        __$$SB_GRAPH_OP_ID$$__: string;
    };
    protected _result(): Promise<T>;
    static jq<T extends keyof FutureTypeMap>(future: JQDirectiveTarget, query: string, futureType?: keyof FutureTypeMap): FutureTypeMap[T];
    toJSON(): {
        id: string;
        directive: any;
    };
}
declare class FutureBoolean extends Future<boolean> {
}
declare class FutureString extends Future<string> {
    static concat(...items: (string | FutureString)[]): FutureString;
    static interpolate(strings: TemplateStringsArray, ...exprs: ({
        toString(): string;
    } | FutureString)[]): FutureString;
    concat(...items: (string | FutureString)[]): FutureString;
    protected _result(): Promise<string>;
}
declare class FutureNumber extends Future<number> {
}
declare abstract class FutureArray extends Future<any[] | FutureArray> {
    abstract at(index: number): Future<any>;
    protected _result(): Promise<any[] | FutureArray>;
}
declare abstract class FutureObject extends Future<Object> {
    get(path: string): Future<any>;
    protected _result(): Promise<Object>;
}
declare class FutureAnyObject extends Future<Object> {
    get(path: string | FutureString): FutureAnyObject;
    at(index: number | FutureNumber): FutureAnyObject;
    protected _result(): Promise<Object>;
}

/**
 * Response to a run request.
 */
declare class SubstrateResponse {
    apiRequest: Request;
    apiResponse: Response;
    json: any;
    constructor(request: Request, response: Response, json?: any);
    get requestId(): string | null;
    /**
     * Returns an error from the `Node` if there was one.
     */
    getError<T extends AnyNode>(node: T): NodeError$1 | undefined;
    /**
     * Returns the result for given `Node`.
     *
     *  @throws {NodeError} when there was an error running the node.
     */
    get<T extends AnyNode>(node: T): NodeOutput<T>;
}

type Options = {
    /** The id of the node. Default: random id */
    id?: Node["id"];
    /** When true the server will omit this node's output. Default: false */
    hide?: boolean;
    /** Number of seconds to cache an output for this node's unique inputs. Default: null */
    cache_age?: number;
    /** Applies if cache_age > 0. Optionally specify a subset of keys to use when computing a cache key.
     * Default: all node arguments
     */
    cache_keys?: string[];
    /** Max number of times to retry this node if it fails. Default: null means no retries */
    max_retries?: number;
    /** Specify nodes that this node depends on. */
    depends?: Node[];
};
declare abstract class Node {
    /** The id of the node. Default: random id */
    id: string;
    /** The type of the node. */
    node: string;
    /** Node inputs */
    args: Object;
    /** When true the server will omit this node's output. Default: false */
    hide: boolean;
    /** Number of seconds to cache an output for this node's unique inputs. Default: null */
    cache_age?: number;
    /** Applies if cache_age > 0. Optionally specify a subset of keys to use when computing a cache key.
     * Default: all node arguments
     */
    cache_keys?: string[];
    /** Max number of times to retry this node if it fails. Default: null means no retries */
    max_retries?: number;
    /** Specify nodes that this node depends on. */
    depends: Node[];
    /** TODO this field stores the last response, but it's just temporary until the internals are refactored */
    protected _response: SubstrateResponse | undefined;
    constructor(args?: Object, opts?: Options);
    /**
     * Reference the future output of this node.
     */
    get future(): any;
    protected set response(res: SubstrateResponse);
    protected output(): any;
    /**
     * Return the resolved result for this node.
     */
    protected result(): Promise<any>;
    toJSON(): {
        _max_retries?: number | undefined;
        _cache_keys?: string[] | undefined;
        _cache_age?: number | undefined;
        id: string;
        node: string;
        args: any;
        _should_output_globally: boolean;
    };
    /**
     * @private
     * For this node, return all the Futures and other Nodes it has a reference to.
     */
    protected references(): {
        nodes: Set<Node>;
        futures: Set<Future<any>>;
    };
}

/**
 * 𐃏 Substrate
 * @generated file
 * 20240617.20240806
 */

type FutureExpandScalar<T> = T extends string ? string | FutureString : T extends number ? number | FutureNumber : T extends boolean ? boolean | FutureBoolean : T;
type FutureExpandObject<T> = T extends object ? {
    [P in keyof T]: FutureExpandAny<T[P]>;
} | FutureObject : T;
type FutureExpandArray<T> = T extends (infer U)[] ? FutureExpandAny<U>[] | FutureArray : FutureExpandAny<T>;
type FutureExpandAny<T> = T extends (infer U)[][] ? FutureExpandArray<U>[][] | FutureArray[] : T extends (infer U)[] ? FutureExpandArray<U>[] | FutureArray : T extends object ? FutureExpandObject<T> : FutureExpandScalar<T>;
/** Response choices. */
declare class MultiComputeTextOutChoices extends FutureArray {
    /** Returns `ComputeTextOut` at given index. */
    at(index: number): ComputeTextOut;
    /** Returns the result for `MultiComputeTextOutChoices` once it's node has been run. */
    protected _result(): Promise<ComputeTextOut[]>;
}
/** Batch outputs. */
declare class BatchComputeTextOutOutputs extends FutureArray {
    /** Returns `ComputeTextOut` at given index. */
    at(index: number): ComputeTextOut;
    /** Returns the result for `BatchComputeTextOutOutputs` once it's node has been run. */
    protected _result(): Promise<ComputeTextOut[]>;
}
/** Response choices. */
declare class MultiComputeJSONOutChoices extends FutureArray {
    /** Returns `ComputeJSONOut` at given index. */
    at(index: number): ComputeJSONOut;
    /** Returns the result for `MultiComputeJSONOutChoices` once it's node has been run. */
    protected _result(): Promise<ComputeJSONOut[]>;
}
/** Batch outputs. */
declare class BatchComputeJSONOutOutputs extends FutureArray {
    /** Returns `ComputeJSONOut` at given index. */
    at(index: number): ComputeJSONOut;
    /** Returns the result for `BatchComputeJSONOutOutputs` once it's node has been run. */
    protected _result(): Promise<ComputeJSONOut[]>;
}
/** Response choices. */
declare class Mistral7BInstructOutChoices extends FutureArray {
    /** Returns `Mistral7BInstructChoice` at given index. */
    at(index: number): Mistral7BInstructChoice;
    /** Returns the result for `Mistral7BInstructOutChoices` once it's node has been run. */
    protected _result(): Promise<Mistral7BInstructChoice[]>;
}
/** Response choices. */
declare class Mixtral8x7BInstructOutChoices extends FutureArray {
    /** Returns `Mixtral8x7BChoice` at given index. */
    at(index: number): Mixtral8x7BChoice;
    /** Returns the result for `Mixtral8x7BInstructOutChoices` once it's node has been run. */
    protected _result(): Promise<Mixtral8x7BChoice[]>;
}
/** Response choices. */
declare class Llama3Instruct8BOutChoices extends FutureArray {
    /** Returns `Llama3Instruct8BChoice` at given index. */
    at(index: number): Llama3Instruct8BChoice;
    /** Returns the result for `Llama3Instruct8BOutChoices` once it's node has been run. */
    protected _result(): Promise<Llama3Instruct8BChoice[]>;
}
/** Response choices. */
declare class Llama3Instruct70BOutChoices extends FutureArray {
    /** Returns `Llama3Instruct70BChoice` at given index. */
    at(index: number): Llama3Instruct70BChoice;
    /** Returns the result for `Llama3Instruct70BOutChoices` once it's node has been run. */
    protected _result(): Promise<Llama3Instruct70BChoice[]>;
}
/** Generated images. */
declare class MultiGenerateImageOutOutputs extends FutureArray {
    /** Returns `GenerateImageOut` at given index. */
    at(index: number): GenerateImageOut;
    /** Returns the result for `MultiGenerateImageOutOutputs` once it's node has been run. */
    protected _result(): Promise<GenerateImageOut[]>;
}
/** Generated images. */
declare class StableDiffusionXLLightningOutOutputs extends FutureArray {
    /** Returns `StableDiffusionImage` at given index. */
    at(index: number): StableDiffusionImage;
    /** Returns the result for `StableDiffusionXLLightningOutOutputs` once it's node has been run. */
    protected _result(): Promise<StableDiffusionImage[]>;
}
/** Generated images. */
declare class StableDiffusionXLControlNetOutOutputs extends FutureArray {
    /** Returns `StableDiffusionImage` at given index. */
    at(index: number): StableDiffusionImage;
    /** Returns the result for `StableDiffusionXLControlNetOutOutputs` once it's node has been run. */
    protected _result(): Promise<StableDiffusionImage[]>;
}
/** Generated frames. */
declare class StableVideoDiffusionOutFrameUris extends FutureArray {
    /** Returns `FutureString` at given index. */
    at(index: number): FutureString;
    /** Returns the result for `StableVideoDiffusionOutFrameUris` once it's node has been run. */
    protected _result(): Promise<FutureString[]>;
}
/** Output frames. */
declare class InterpolateFramesOutFrameUris extends FutureArray {
    /** Returns `FutureString` at given index. */
    at(index: number): FutureString;
    /** Returns the result for `InterpolateFramesOutFrameUris` once it's node has been run. */
    protected _result(): Promise<FutureString[]>;
}
/** Generated images. */
declare class MultiInpaintImageOutOutputs extends FutureArray {
    /** Returns `InpaintImageOut` at given index. */
    at(index: number): InpaintImageOut;
    /** Returns the result for `MultiInpaintImageOutOutputs` once it's node has been run. */
    protected _result(): Promise<InpaintImageOut[]>;
}
/** Generated images. */
declare class StableDiffusionXLInpaintOutOutputs extends FutureArray {
    /** Returns `StableDiffusionImage` at given index. */
    at(index: number): StableDiffusionImage;
    /** Returns the result for `StableDiffusionXLInpaintOutOutputs` once it's node has been run. */
    protected _result(): Promise<StableDiffusionImage[]>;
}
/** Aligned words, if `align` is enabled. */
declare class TranscribedSegmentWords extends FutureArray {
    /** Returns `TranscribedWord` at given index. */
    at(index: number): TranscribedWord;
    /** Returns the result for `TranscribedSegmentWords` once it's node has been run. */
    protected _result(): Promise<TranscribedWord[]>;
}
/** Transcribed segments, if `segment` is enabled. */
declare class TranscribeSpeechOutSegments extends FutureArray {
    /** Returns `TranscribedSegment` at given index. */
    at(index: number): TranscribedSegment;
    /** Returns the result for `TranscribeSpeechOutSegments` once it's node has been run. */
    protected _result(): Promise<TranscribedSegment[]>;
}
/** Chapter markers, if `suggest_chapters` is enabled. */
declare class TranscribeSpeechOutChapters extends FutureArray {
    /** Returns `ChapterMarker` at given index. */
    at(index: number): ChapterMarker;
    /** Returns the result for `TranscribeSpeechOutChapters` once it's node has been run. */
    protected _result(): Promise<ChapterMarker[]>;
}
/** Embedding vector. */
declare class EmbeddingVector extends FutureArray {
    /** Returns `FutureNumber` at given index. */
    at(index: number): FutureNumber;
    /** Returns the result for `EmbeddingVector` once it's node has been run. */
    protected _result(): Promise<FutureNumber[]>;
}
/** Generated embeddings. */
declare class MultiEmbedTextOutEmbeddings extends FutureArray {
    /** Returns `Embedding` at given index. */
    at(index: number): Embedding;
    /** Returns the result for `MultiEmbedTextOutEmbeddings` once it's node has been run. */
    protected _result(): Promise<Embedding[]>;
}
/** Generated embeddings. */
declare class JinaV2OutEmbeddings extends FutureArray {
    /** Returns `Embedding` at given index. */
    at(index: number): Embedding;
    /** Returns the result for `JinaV2OutEmbeddings` once it's node has been run. */
    protected _result(): Promise<Embedding[]>;
}
/** Generated embeddings. */
declare class MultiEmbedImageOutEmbeddings extends FutureArray {
    /** Returns `Embedding` at given index. */
    at(index: number): Embedding;
    /** Returns the result for `MultiEmbedImageOutEmbeddings` once it's node has been run. */
    protected _result(): Promise<Embedding[]>;
}
/** Generated embeddings. */
declare class CLIPOutEmbeddings extends FutureArray {
    /** Returns `Embedding` at given index. */
    at(index: number): Embedding;
    /** Returns the result for `CLIPOutEmbeddings` once it's node has been run. */
    protected _result(): Promise<Embedding[]>;
}
/** List of vector stores. */
declare class ListVectorStoresOutItems extends FutureArray {
    /** Returns `FindOrCreateVectorStoreOut` at given index. */
    at(index: number): FindOrCreateVectorStoreOut;
    /** Returns the result for `ListVectorStoresOutItems` once it's node has been run. */
    protected _result(): Promise<FindOrCreateVectorStoreOut[]>;
}
/** Embedding vector. */
declare class VectorVector extends FutureArray {
    /** Returns `FutureNumber` at given index. */
    at(index: number): FutureNumber;
    /** Returns the result for `VectorVector` once it's node has been run. */
    protected _result(): Promise<FutureNumber[]>;
}
/** Retrieved vectors. */
declare class FetchVectorsOutVectors extends FutureArray {
    /** Returns `Vector` at given index. */
    at(index: number): Vector;
    /** Returns the result for `FetchVectorsOutVectors` once it's node has been run. */
    protected _result(): Promise<Vector[]>;
}
/** Embedding vector. */
declare class VectorStoreQueryResultVector extends FutureArray {
    /** Returns `FutureNumber` at given index. */
    at(index: number): FutureNumber;
    /** Returns the result for `VectorStoreQueryResultVector` once it's node has been run. */
    protected _result(): Promise<FutureNumber[]>;
}
/** Query results. */
declare class QueryVectorStoreOutResults extends FutureArray {
    /** Returns `QueryVectorStoreOutResultsItem` at given index. */
    at(index: number): QueryVectorStoreOutResultsItem;
    /** Returns the result for `QueryVectorStoreOutResults` once it's node has been run. */
    protected _result(): Promise<QueryVectorStoreOutResultsItem>;
}
/** QueryVectorStoreOutResultsItem */
declare class QueryVectorStoreOutResultsItem extends FutureArray {
    /** Returns `VectorStoreQueryResult` at given index. */
    at(index: number): VectorStoreQueryResult;
    /** Returns the result for `QueryVectorStoreOutResultsItem` once it's node has been run. */
    protected _result(): Promise<VectorStoreQueryResult[]>;
}
/** Document chunks */
declare class SplitDocumentOutItems extends FutureArray {
    /** Returns `EmbedTextItem` at given index. */
    at(index: number): EmbedTextItem;
    /** Returns the result for `SplitDocumentOutItems` once it's node has been run. */
    protected _result(): Promise<EmbedTextItem[]>;
}
/** ExperimentalOut */
declare class ExperimentalOut extends FutureObject {
    /** Response. */
    get output(): FutureAnyObject;
    /** returns the result for `ExperimentalOut` once it's node has been run. */
    protected _result(): Promise<ExperimentalOut>;
}
/** BoxOut */
declare class BoxOut extends FutureObject {
    /** The evaluated result. */
    get value(): FutureAnyObject;
    /** returns the result for `BoxOut` once it's node has been run. */
    protected _result(): Promise<BoxOut>;
}
/** IfOut */
declare class IfOut extends FutureObject {
    /** Result. Null if `value_if_false` is not provided and `condition` is false. */
    get result(): FutureAnyObject;
    /** returns the result for `IfOut` once it's node has been run. */
    protected _result(): Promise<IfOut>;
}
/** ComputeTextOut */
declare class ComputeTextOut extends FutureObject {
    /** Text response. */
    get text(): FutureString;
    /** returns the result for `ComputeTextOut` once it's node has been run. */
    protected _result(): Promise<ComputeTextOut>;
}
/** ComputeJSONOut */
declare class ComputeJSONOut extends FutureObject {
    /** JSON response. */
    get json_object(): FutureAnyObject;
    /** If the model output could not be parsed to JSON, this is the raw text output. */
    get text(): FutureString;
    /** returns the result for `ComputeJSONOut` once it's node has been run. */
    protected _result(): Promise<ComputeJSONOut>;
}
/** MultiComputeTextOut */
declare class MultiComputeTextOut extends FutureObject {
    /** Response choices. */
    get choices(): MultiComputeTextOutChoices;
    /** returns the result for `MultiComputeTextOut` once it's node has been run. */
    protected _result(): Promise<MultiComputeTextOut>;
}
/** BatchComputeTextOut */
declare class BatchComputeTextOut extends FutureObject {
    /** Batch outputs. */
    get outputs(): BatchComputeTextOutOutputs;
    /** returns the result for `BatchComputeTextOut` once it's node has been run. */
    protected _result(): Promise<BatchComputeTextOut>;
}
/** MultiComputeJSONOut */
declare class MultiComputeJSONOut extends FutureObject {
    /** Response choices. */
    get choices(): MultiComputeJSONOutChoices;
    /** returns the result for `MultiComputeJSONOut` once it's node has been run. */
    protected _result(): Promise<MultiComputeJSONOut>;
}
/** BatchComputeJSONOut */
declare class BatchComputeJSONOut extends FutureObject {
    /** Batch outputs. */
    get outputs(): BatchComputeJSONOutOutputs;
    /** returns the result for `BatchComputeJSONOut` once it's node has been run. */
    protected _result(): Promise<BatchComputeJSONOut>;
}
/** Mistral7BInstructChoice */
declare class Mistral7BInstructChoice extends FutureObject {
    /** Text response, if `json_schema` was not provided. */
    get text(): FutureString;
    /** JSON response, if `json_schema` was provided. */
    get json_object(): FutureAnyObject;
    /** returns the result for `Mistral7BInstructChoice` once it's node has been run. */
    protected _result(): Promise<Mistral7BInstructChoice>;
}
/** Mistral7BInstructOut */
declare class Mistral7BInstructOut extends FutureObject {
    /** Response choices. */
    get choices(): Mistral7BInstructOutChoices;
    /** returns the result for `Mistral7BInstructOut` once it's node has been run. */
    protected _result(): Promise<Mistral7BInstructOut>;
}
/** Mixtral8x7BChoice */
declare class Mixtral8x7BChoice extends FutureObject {
    /** Text response, if `json_schema` was not provided. */
    get text(): FutureString;
    /** JSON response, if `json_schema` was provided. */
    get json_object(): FutureAnyObject;
    /** returns the result for `Mixtral8x7BChoice` once it's node has been run. */
    protected _result(): Promise<Mixtral8x7BChoice>;
}
/** Mixtral8x7BInstructOut */
declare class Mixtral8x7BInstructOut extends FutureObject {
    /** Response choices. */
    get choices(): Mixtral8x7BInstructOutChoices;
    /** returns the result for `Mixtral8x7BInstructOut` once it's node has been run. */
    protected _result(): Promise<Mixtral8x7BInstructOut>;
}
/** Llama3Instruct8BChoice */
declare class Llama3Instruct8BChoice extends FutureObject {
    /** Text response. */
    get text(): FutureString;
    /** JSON response, if `json_schema` was provided. */
    get json_object(): FutureAnyObject;
    /** returns the result for `Llama3Instruct8BChoice` once it's node has been run. */
    protected _result(): Promise<Llama3Instruct8BChoice>;
}
/** Llama3Instruct8BOut */
declare class Llama3Instruct8BOut extends FutureObject {
    /** Response choices. */
    get choices(): Llama3Instruct8BOutChoices;
    /** returns the result for `Llama3Instruct8BOut` once it's node has been run. */
    protected _result(): Promise<Llama3Instruct8BOut>;
}
/** Llama3Instruct70BChoice */
declare class Llama3Instruct70BChoice extends FutureObject {
    /** Text response. */
    get text(): FutureString;
    /** returns the result for `Llama3Instruct70BChoice` once it's node has been run. */
    protected _result(): Promise<Llama3Instruct70BChoice>;
}
/** Llama3Instruct70BOut */
declare class Llama3Instruct70BOut extends FutureObject {
    /** Response choices. */
    get choices(): Llama3Instruct70BOutChoices;
    /** returns the result for `Llama3Instruct70BOut` once it's node has been run. */
    protected _result(): Promise<Llama3Instruct70BOut>;
}
/** Firellava13BOut */
declare class Firellava13BOut extends FutureObject {
    /** Text response. */
    get text(): FutureString;
    /** returns the result for `Firellava13BOut` once it's node has been run. */
    protected _result(): Promise<Firellava13BOut>;
}
/** GenerateImageOut */
declare class GenerateImageOut extends FutureObject {
    /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get image_uri(): FutureString;
    /** returns the result for `GenerateImageOut` once it's node has been run. */
    protected _result(): Promise<GenerateImageOut>;
}
/** MultiGenerateImageOut */
declare class MultiGenerateImageOut extends FutureObject {
    /** Generated images. */
    get outputs(): MultiGenerateImageOutOutputs;
    /** returns the result for `MultiGenerateImageOut` once it's node has been run. */
    protected _result(): Promise<MultiGenerateImageOut>;
}
/** StableDiffusionImage */
declare class StableDiffusionImage extends FutureObject {
    /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get image_uri(): FutureString;
    /** The random noise seed used for generation. */
    get seed(): FutureNumber;
    /** returns the result for `StableDiffusionImage` once it's node has been run. */
    protected _result(): Promise<StableDiffusionImage>;
}
/** StableDiffusionXLLightningOut */
declare class StableDiffusionXLLightningOut extends FutureObject {
    /** Generated images. */
    get outputs(): StableDiffusionXLLightningOutOutputs;
    /** returns the result for `StableDiffusionXLLightningOut` once it's node has been run. */
    protected _result(): Promise<StableDiffusionXLLightningOut>;
}
/** StableDiffusionXLControlNetOut */
declare class StableDiffusionXLControlNetOut extends FutureObject {
    /** Generated images. */
    get outputs(): StableDiffusionXLControlNetOutOutputs;
    /** returns the result for `StableDiffusionXLControlNetOut` once it's node has been run. */
    protected _result(): Promise<StableDiffusionXLControlNetOut>;
}
/** StableVideoDiffusionOut */
declare class StableVideoDiffusionOut extends FutureObject {
    /** Generated video. */
    get video_uri(): FutureString;
    /** Generated frames. */
    get frame_uris(): StableVideoDiffusionOutFrameUris;
    /** returns the result for `StableVideoDiffusionOut` once it's node has been run. */
    protected _result(): Promise<StableVideoDiffusionOut>;
}
/** InterpolateFramesOut */
declare class InterpolateFramesOut extends FutureObject {
    /** Generated video. */
    get video_uri(): FutureString;
    /** Output frames. */
    get frame_uris(): InterpolateFramesOutFrameUris;
    /** returns the result for `InterpolateFramesOut` once it's node has been run. */
    protected _result(): Promise<InterpolateFramesOut>;
}
/** InpaintImageOut */
declare class InpaintImageOut extends FutureObject {
    /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get image_uri(): FutureString;
    /** returns the result for `InpaintImageOut` once it's node has been run. */
    protected _result(): Promise<InpaintImageOut>;
}
/** MultiInpaintImageOut */
declare class MultiInpaintImageOut extends FutureObject {
    /** Generated images. */
    get outputs(): MultiInpaintImageOutOutputs;
    /** returns the result for `MultiInpaintImageOut` once it's node has been run. */
    protected _result(): Promise<MultiInpaintImageOut>;
}
/** StableDiffusionXLInpaintOut */
declare class StableDiffusionXLInpaintOut extends FutureObject {
    /** Generated images. */
    get outputs(): StableDiffusionXLInpaintOutOutputs;
    /** returns the result for `StableDiffusionXLInpaintOut` once it's node has been run. */
    protected _result(): Promise<StableDiffusionXLInpaintOut>;
}
/** EraseImageOut */
declare class EraseImageOut extends FutureObject {
    /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get image_uri(): FutureString;
    /** returns the result for `EraseImageOut` once it's node has been run. */
    protected _result(): Promise<EraseImageOut>;
}
/** RemoveBackgroundOut */
declare class RemoveBackgroundOut extends FutureObject {
    /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get image_uri(): FutureString;
    /** returns the result for `RemoveBackgroundOut` once it's node has been run. */
    protected _result(): Promise<RemoveBackgroundOut>;
}
/** UpscaleImageOut */
declare class UpscaleImageOut extends FutureObject {
    /** Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get image_uri(): FutureString;
    /** returns the result for `UpscaleImageOut` once it's node has been run. */
    protected _result(): Promise<UpscaleImageOut>;
}
/** SegmentUnderPointOut */
declare class SegmentUnderPointOut extends FutureObject {
    /** Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get mask_image_uri(): FutureString;
    /** returns the result for `SegmentUnderPointOut` once it's node has been run. */
    protected _result(): Promise<SegmentUnderPointOut>;
}
/** SegmentAnythingOut */
declare class SegmentAnythingOut extends FutureObject {
    /** Detected segments in 'mask image' format. Base 64-encoded JPEG image bytes, or a hosted image url if `store` is provided. */
    get mask_image_uri(): FutureString;
    /** returns the result for `SegmentAnythingOut` once it's node has been run. */
    protected _result(): Promise<SegmentAnythingOut>;
}
/** TranscribedWord */
declare class TranscribedWord extends FutureObject {
    /** Text of word. */
    get word(): FutureString;
    /** (Optional) Start time of word, in seconds. */
    get start(): FutureNumber;
    /** (Optional) End time of word, in seconds. */
    get end(): FutureNumber;
    /** (Optional) ID of speaker, if `diarize` is enabled. */
    get speaker(): FutureString;
    /** returns the result for `TranscribedWord` once it's node has been run. */
    protected _result(): Promise<TranscribedWord>;
}
/** TranscribedSegment */
declare class TranscribedSegment extends FutureObject {
    /** Text of segment. */
    get text(): FutureString;
    /** Start time of segment, in seconds. */
    get start(): FutureNumber;
    /** End time of segment, in seconds. */
    get end(): FutureNumber;
    /** (Optional) ID of speaker, if `diarize` is enabled. */
    get speaker(): FutureString;
    /** (Optional) Aligned words, if `align` is enabled. */
    get words(): TranscribedSegmentWords;
    /** returns the result for `TranscribedSegment` once it's node has been run. */
    protected _result(): Promise<TranscribedSegment>;
}
/** ChapterMarker */
declare class ChapterMarker extends FutureObject {
    /** Chapter title. */
    get title(): FutureString;
    /** Start time of chapter, in seconds. */
    get start(): FutureNumber;
    /** returns the result for `ChapterMarker` once it's node has been run. */
    protected _result(): Promise<ChapterMarker>;
}
/** TranscribeSpeechOut */
declare class TranscribeSpeechOut extends FutureObject {
    /** Transcribed text. */
    get text(): FutureString;
    /** (Optional) Transcribed segments, if `segment` is enabled. */
    get segments(): TranscribeSpeechOutSegments;
    /** (Optional) Chapter markers, if `suggest_chapters` is enabled. */
    get chapters(): TranscribeSpeechOutChapters;
    /** returns the result for `TranscribeSpeechOut` once it's node has been run. */
    protected _result(): Promise<TranscribeSpeechOut>;
}
/** GenerateSpeechOut */
declare class GenerateSpeechOut extends FutureObject {
    /** Base 64-encoded WAV audio bytes, or a hosted audio url if `store` is provided. */
    get audio_uri(): FutureString;
    /** returns the result for `GenerateSpeechOut` once it's node has been run. */
    protected _result(): Promise<GenerateSpeechOut>;
}
/** Embedding */
declare class Embedding extends FutureObject {
    /** Embedding vector. */
    get vector(): EmbeddingVector;
    /** (Optional) Vector store document ID. */
    get doc_id(): FutureString;
    /** (Optional) Vector store document metadata. */
    get metadata(): FutureAnyObject;
    /** returns the result for `Embedding` once it's node has been run. */
    protected _result(): Promise<Embedding>;
}
/** EmbedTextOut */
declare class EmbedTextOut extends FutureObject {
    /** Generated embedding. */
    get embedding(): Embedding;
    /** returns the result for `EmbedTextOut` once it's node has been run. */
    protected _result(): Promise<EmbedTextOut>;
}
/** EmbedTextItem */
declare class EmbedTextItem extends FutureObject {
    /** Text to embed. */
    get text(): FutureString;
    /** (Optional) Metadata that can be used to query the vector store. Ignored if `collection_name` is unset. */
    get metadata(): FutureAnyObject;
    /** (Optional) Vector store document ID. Ignored if `collection_name` is unset. */
    get doc_id(): FutureString;
    /** returns the result for `EmbedTextItem` once it's node has been run. */
    protected _result(): Promise<EmbedTextItem>;
}
/** MultiEmbedTextOut */
declare class MultiEmbedTextOut extends FutureObject {
    /** Generated embeddings. */
    get embeddings(): MultiEmbedTextOutEmbeddings;
    /** returns the result for `MultiEmbedTextOut` once it's node has been run. */
    protected _result(): Promise<MultiEmbedTextOut>;
}
/** JinaV2Out */
declare class JinaV2Out extends FutureObject {
    /** Generated embeddings. */
    get embeddings(): JinaV2OutEmbeddings;
    /** returns the result for `JinaV2Out` once it's node has been run. */
    protected _result(): Promise<JinaV2Out>;
}
/** EmbedImageOut */
declare class EmbedImageOut extends FutureObject {
    /** Generated embedding. */
    get embedding(): Embedding;
    /** returns the result for `EmbedImageOut` once it's node has been run. */
    protected _result(): Promise<EmbedImageOut>;
}
/** MultiEmbedImageOut */
declare class MultiEmbedImageOut extends FutureObject {
    /** Generated embeddings. */
    get embeddings(): MultiEmbedImageOutEmbeddings;
    /** returns the result for `MultiEmbedImageOut` once it's node has been run. */
    protected _result(): Promise<MultiEmbedImageOut>;
}
/** CLIPOut */
declare class CLIPOut extends FutureObject {
    /** Generated embeddings. */
    get embeddings(): CLIPOutEmbeddings;
    /** returns the result for `CLIPOut` once it's node has been run. */
    protected _result(): Promise<CLIPOut>;
}
/** FindOrCreateVectorStoreOut */
declare class FindOrCreateVectorStoreOut extends FutureObject {
    /** Vector store name. */
    get collection_name(): FutureString;
    /** Selected embedding model. */
    get model(): FutureString;
    /** (Optional) Number of leaves in the vector store. */
    get num_leaves(): FutureNumber;
    /** returns the result for `FindOrCreateVectorStoreOut` once it's node has been run. */
    protected _result(): Promise<FindOrCreateVectorStoreOut>;
}
/** ListVectorStoresOut */
declare class ListVectorStoresOut extends FutureObject {
    /** List of vector stores. */
    get items(): ListVectorStoresOutItems;
    /** returns the result for `ListVectorStoresOut` once it's node has been run. */
    protected _result(): Promise<ListVectorStoresOut>;
}
/** DeleteVectorStoreOut */
declare class DeleteVectorStoreOut extends FutureObject {
    /** Vector store name. */
    get collection_name(): FutureString;
    /** Selected embedding model. */
    get model(): FutureString;
    /** returns the result for `DeleteVectorStoreOut` once it's node has been run. */
    protected _result(): Promise<DeleteVectorStoreOut>;
}
/** Canonical representation of document with embedding vector. */
declare class Vector extends FutureObject {
    /** Document ID. */
    get id(): FutureString;
    /** Embedding vector. */
    get vector(): VectorVector;
    /** Document metadata. */
    get metadata(): FutureAnyObject;
    /** returns the result for `Vector` once it's node has been run. */
    protected _result(): Promise<Vector>;
}
/** FetchVectorsOut */
declare class FetchVectorsOut extends FutureObject {
    /** Retrieved vectors. */
    get vectors(): FetchVectorsOutVectors;
    /** returns the result for `FetchVectorsOut` once it's node has been run. */
    protected _result(): Promise<FetchVectorsOut>;
}
/** UpdateVectorsOut */
declare class UpdateVectorsOut extends FutureObject {
    /** Number of vectors modified. */
    get count(): FutureNumber;
    /** returns the result for `UpdateVectorsOut` once it's node has been run. */
    protected _result(): Promise<UpdateVectorsOut>;
}
/** DeleteVectorsOut */
declare class DeleteVectorsOut extends FutureObject {
    /** Number of vectors modified. */
    get count(): FutureNumber;
    /** returns the result for `DeleteVectorsOut` once it's node has been run. */
    protected _result(): Promise<DeleteVectorsOut>;
}
/** VectorStoreQueryResult */
declare class VectorStoreQueryResult extends FutureObject {
    /** Document ID. */
    get id(): FutureString;
    /** Similarity score. */
    get distance(): FutureNumber;
    /** (Optional) Embedding vector. */
    get vector(): VectorStoreQueryResultVector;
    /** (Optional) Document metadata. */
    get metadata(): FutureAnyObject;
    /** returns the result for `VectorStoreQueryResult` once it's node has been run. */
    protected _result(): Promise<VectorStoreQueryResult>;
}
/** QueryVectorStoreOut */
declare class QueryVectorStoreOut extends FutureObject {
    /** Query results. */
    get results(): QueryVectorStoreOutResults;
    /** (Optional) Vector store name. */
    get collection_name(): FutureString;
    /** (Optional) Selected embedding model. */
    get model(): FutureString;
    /** returns the result for `QueryVectorStoreOut` once it's node has been run. */
    protected _result(): Promise<QueryVectorStoreOut>;
}
/** SplitDocumentOut */
declare class SplitDocumentOut extends FutureObject {
    /** Document chunks */
    get items(): SplitDocumentOutItems;
    /** returns the result for `SplitDocumentOut` once it's node has been run. */
    protected _result(): Promise<SplitDocumentOut>;
}
declare namespace Experimental {
    /**
     * Experimental Input
     * https://www.substrate.run/nodes#Experimental
     */
    type Input = FutureExpandAny<components["schemas"]["ExperimentalIn"]>;
    /**
     * Experimental Output
     * https://www.substrate.run/nodes#Experimental
     */
    type Output = components["schemas"]["ExperimentalOut"];
}
/**
 * Experimental node.
 *
 * https://www.substrate.run/nodes#Experimental
 */
declare class Experimental extends Node {
    /**
     * Input arguments: `name`, `args`, `timeout` (optional)
     *
     * Output fields: `output`
     *
     * https://www.substrate.run/nodes#Experimental
     */
    constructor(args: FutureExpandAny<components["schemas"]["ExperimentalIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `output`
     *
     * https://www.substrate.run/nodes#Experimental
     */
    protected result(): Promise<components["schemas"]["ExperimentalOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `output`
     *
     * https://www.substrate.run/nodes#Experimental
     */
    get future(): ExperimentalOut;
    protected output(): components["schemas"]["ExperimentalOut"];
}
declare namespace Box {
    /**
     * Box Input
     * https://www.substrate.run/nodes#Box
     */
    type Input = FutureExpandAny<components["schemas"]["BoxIn"]>;
    /**
     * Box Output
     * https://www.substrate.run/nodes#Box
     */
    type Output = components["schemas"]["BoxOut"];
}
/**
 * Combine multiple values into a single output.
 *
 * https://www.substrate.run/nodes#Box
 */
declare class Box extends Node {
    /**
     * Input arguments: `value`
     *
     * Output fields: `value`
     *
     * https://www.substrate.run/nodes#Box
     */
    constructor(args: FutureExpandAny<components["schemas"]["BoxIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `value`
     *
     * https://www.substrate.run/nodes#Box
     */
    protected result(): Promise<components["schemas"]["BoxOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `value`
     *
     * https://www.substrate.run/nodes#Box
     */
    get future(): BoxOut;
    protected output(): components["schemas"]["BoxOut"];
}
declare namespace If {
    /**
     * If Input
     * https://www.substrate.run/nodes#If
     */
    type Input = FutureExpandAny<components["schemas"]["IfIn"]>;
    /**
     * If Output
     * https://www.substrate.run/nodes#If
     */
    type Output = components["schemas"]["IfOut"];
}
/**
 * Return one of two options based on a condition.
 *
 * https://www.substrate.run/nodes#If
 */
declare class If extends Node {
    /**
     * Input arguments: `condition`, `value_if_true`, `value_if_false` (optional)
     *
     * Output fields: `result`
     *
     * https://www.substrate.run/nodes#If
     */
    constructor(args: FutureExpandAny<components["schemas"]["IfIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `result`
     *
     * https://www.substrate.run/nodes#If
     */
    protected result(): Promise<components["schemas"]["IfOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `result`
     *
     * https://www.substrate.run/nodes#If
     */
    get future(): IfOut;
    protected output(): components["schemas"]["IfOut"];
}
declare namespace ComputeText {
    /**
     * ComputeText Input
     * https://www.substrate.run/nodes#ComputeText
     */
    type Input = FutureExpandAny<components["schemas"]["ComputeTextIn"]>;
    /**
     * ComputeText Output
     * https://www.substrate.run/nodes#ComputeText
     */
    type Output = components["schemas"]["ComputeTextOut"];
}
/**
 * Compute text using a language model.
 *
 * https://www.substrate.run/nodes#ComputeText
 */
declare class ComputeText extends Node {
    /**
     * Input arguments: `prompt`, `image_uris` (optional), `temperature` (optional), `max_tokens` (optional), `model` (optional)
     *
     * Output fields: `text`
     *
     * https://www.substrate.run/nodes#ComputeText
     */
    constructor(args: FutureExpandAny<components["schemas"]["ComputeTextIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `text`
     *
     * https://www.substrate.run/nodes#ComputeText
     */
    protected result(): Promise<components["schemas"]["ComputeTextOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `text`
     *
     * https://www.substrate.run/nodes#ComputeText
     */
    get future(): ComputeTextOut;
    protected output(): components["schemas"]["ComputeTextOut"];
}
declare namespace MultiComputeText {
    /**
     * MultiComputeText Input
     * https://www.substrate.run/nodes#MultiComputeText
     */
    type Input = FutureExpandAny<components["schemas"]["MultiComputeTextIn"]>;
    /**
     * MultiComputeText Output
     * https://www.substrate.run/nodes#MultiComputeText
     */
    type Output = components["schemas"]["MultiComputeTextOut"];
}
/**
 * Generate multiple text choices using a language model.
 *
 * https://www.substrate.run/nodes#MultiComputeText
 */
declare class MultiComputeText extends Node {
    /**
     * Input arguments: `prompt`, `num_choices`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#MultiComputeText
     */
    constructor(args: FutureExpandAny<components["schemas"]["MultiComputeTextIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#MultiComputeText
     */
    protected result(): Promise<components["schemas"]["MultiComputeTextOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#MultiComputeText
     */
    get future(): MultiComputeTextOut;
    protected output(): components["schemas"]["MultiComputeTextOut"];
}
declare namespace BatchComputeText {
    /**
     * BatchComputeText Input
     * https://www.substrate.run/nodes#BatchComputeText
     */
    type Input = FutureExpandAny<components["schemas"]["BatchComputeTextIn"]>;
    /**
     * BatchComputeText Output
     * https://www.substrate.run/nodes#BatchComputeText
     */
    type Output = components["schemas"]["BatchComputeTextOut"];
}
/**
 * Compute text for multiple prompts in batch using a language model.
 *
 * https://www.substrate.run/nodes#BatchComputeText
 */
declare class BatchComputeText extends Node {
    /**
     * Input arguments: `prompts`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#BatchComputeText
     */
    constructor(args: FutureExpandAny<components["schemas"]["BatchComputeTextIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#BatchComputeText
     */
    protected result(): Promise<components["schemas"]["BatchComputeTextOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#BatchComputeText
     */
    get future(): BatchComputeTextOut;
    protected output(): components["schemas"]["BatchComputeTextOut"];
}
declare namespace BatchComputeJSON {
    /**
     * BatchComputeJSON Input
     * https://www.substrate.run/nodes#BatchComputeJSON
     */
    type Input = FutureExpandAny<components["schemas"]["BatchComputeJSONIn"]>;
    /**
     * BatchComputeJSON Output
     * https://www.substrate.run/nodes#BatchComputeJSON
     */
    type Output = components["schemas"]["BatchComputeJSONOut"];
}
/**
 * Compute JSON for multiple prompts in batch using a language model.
 *
 * https://www.substrate.run/nodes#BatchComputeJSON
 */
declare class BatchComputeJSON extends Node {
    /**
     * Input arguments: `prompts`, `json_schema`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#BatchComputeJSON
     */
    constructor(args: FutureExpandAny<components["schemas"]["BatchComputeJSONIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#BatchComputeJSON
     */
    protected result(): Promise<components["schemas"]["BatchComputeJSONOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#BatchComputeJSON
     */
    get future(): BatchComputeJSONOut;
    protected output(): components["schemas"]["BatchComputeJSONOut"];
}
declare namespace ComputeJSON {
    /**
     * ComputeJSON Input
     * https://www.substrate.run/nodes#ComputeJSON
     */
    type Input = FutureExpandAny<components["schemas"]["ComputeJSONIn"]>;
    /**
     * ComputeJSON Output
     * https://www.substrate.run/nodes#ComputeJSON
     */
    type Output = components["schemas"]["ComputeJSONOut"];
}
/**
 * Compute JSON using a language model.
 *
 * https://www.substrate.run/nodes#ComputeJSON
 */
declare class ComputeJSON extends Node {
    /**
     * Input arguments: `prompt`, `json_schema`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
     *
     * Output fields: `json_object` (optional), `text` (optional)
     *
     * https://www.substrate.run/nodes#ComputeJSON
     */
    constructor(args: FutureExpandAny<components["schemas"]["ComputeJSONIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `json_object` (optional), `text` (optional)
     *
     * https://www.substrate.run/nodes#ComputeJSON
     */
    protected result(): Promise<components["schemas"]["ComputeJSONOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `json_object` (optional), `text` (optional)
     *
     * https://www.substrate.run/nodes#ComputeJSON
     */
    get future(): ComputeJSONOut;
    protected output(): components["schemas"]["ComputeJSONOut"];
}
declare namespace MultiComputeJSON {
    /**
     * MultiComputeJSON Input
     * https://www.substrate.run/nodes#MultiComputeJSON
     */
    type Input = FutureExpandAny<components["schemas"]["MultiComputeJSONIn"]>;
    /**
     * MultiComputeJSON Output
     * https://www.substrate.run/nodes#MultiComputeJSON
     */
    type Output = components["schemas"]["MultiComputeJSONOut"];
}
/**
 * Compute multiple JSON choices using a language model.
 *
 * https://www.substrate.run/nodes#MultiComputeJSON
 */
declare class MultiComputeJSON extends Node {
    /**
     * Input arguments: `prompt`, `json_schema`, `num_choices`, `temperature` (optional), `max_tokens` (optional), `model` (optional)
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#MultiComputeJSON
     */
    constructor(args: FutureExpandAny<components["schemas"]["MultiComputeJSONIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#MultiComputeJSON
     */
    protected result(): Promise<components["schemas"]["MultiComputeJSONOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#MultiComputeJSON
     */
    get future(): MultiComputeJSONOut;
    protected output(): components["schemas"]["MultiComputeJSONOut"];
}
declare namespace Mistral7BInstruct {
    /**
     * Mistral7BInstruct Input
     * https://www.substrate.run/nodes#Mistral7BInstruct
     */
    type Input = FutureExpandAny<components["schemas"]["Mistral7BInstructIn"]>;
    /**
     * Mistral7BInstruct Output
     * https://www.substrate.run/nodes#Mistral7BInstruct
     */
    type Output = components["schemas"]["Mistral7BInstructOut"];
}
/**
 * Compute text using [Mistral 7B Instruct](https://mistral.ai/news/announcing-mistral-7b).
 *
 * https://www.substrate.run/nodes#Mistral7BInstruct
 */
declare class Mistral7BInstruct extends Node {
    /**
     * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `json_schema` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional)
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Mistral7BInstruct
     */
    constructor(args: FutureExpandAny<components["schemas"]["Mistral7BInstructIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Mistral7BInstruct
     */
    protected result(): Promise<components["schemas"]["Mistral7BInstructOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Mistral7BInstruct
     */
    get future(): Mistral7BInstructOut;
    protected output(): components["schemas"]["Mistral7BInstructOut"];
}
declare namespace Mixtral8x7BInstruct {
    /**
     * Mixtral8x7BInstruct Input
     * https://www.substrate.run/nodes#Mixtral8x7BInstruct
     */
    type Input = FutureExpandAny<components["schemas"]["Mixtral8x7BInstructIn"]>;
    /**
     * Mixtral8x7BInstruct Output
     * https://www.substrate.run/nodes#Mixtral8x7BInstruct
     */
    type Output = components["schemas"]["Mixtral8x7BInstructOut"];
}
/**
 * Compute text using instruct-tuned [Mixtral 8x7B](https://mistral.ai/news/mixtral-of-experts/).
 *
 * https://www.substrate.run/nodes#Mixtral8x7BInstruct
 */
declare class Mixtral8x7BInstruct extends Node {
    /**
     * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `json_schema` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional)
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Mixtral8x7BInstruct
     */
    constructor(args: FutureExpandAny<components["schemas"]["Mixtral8x7BInstructIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Mixtral8x7BInstruct
     */
    protected result(): Promise<components["schemas"]["Mixtral8x7BInstructOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Mixtral8x7BInstruct
     */
    get future(): Mixtral8x7BInstructOut;
    protected output(): components["schemas"]["Mixtral8x7BInstructOut"];
}
declare namespace Llama3Instruct8B {
    /**
     * Llama3Instruct8B Input
     * https://www.substrate.run/nodes#Llama3Instruct8B
     */
    type Input = FutureExpandAny<components["schemas"]["Llama3Instruct8BIn"]>;
    /**
     * Llama3Instruct8B Output
     * https://www.substrate.run/nodes#Llama3Instruct8B
     */
    type Output = components["schemas"]["Llama3Instruct8BOut"];
}
/**
 * Compute text using instruct-tuned [Llama 3 8B](https://llama.meta.com/llama3/).
 *
 * https://www.substrate.run/nodes#Llama3Instruct8B
 */
declare class Llama3Instruct8B extends Node {
    /**
     * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional), `json_schema` (optional)
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Llama3Instruct8B
     */
    constructor(args: FutureExpandAny<components["schemas"]["Llama3Instruct8BIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Llama3Instruct8B
     */
    protected result(): Promise<components["schemas"]["Llama3Instruct8BOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Llama3Instruct8B
     */
    get future(): Llama3Instruct8BOut;
    protected output(): components["schemas"]["Llama3Instruct8BOut"];
}
declare namespace Llama3Instruct70B {
    /**
     * Llama3Instruct70B Input
     * https://www.substrate.run/nodes#Llama3Instruct70B
     */
    type Input = FutureExpandAny<components["schemas"]["Llama3Instruct70BIn"]>;
    /**
     * Llama3Instruct70B Output
     * https://www.substrate.run/nodes#Llama3Instruct70B
     */
    type Output = components["schemas"]["Llama3Instruct70BOut"];
}
/**
 * Compute text using instruct-tuned [Llama 3 70B](https://llama.meta.com/llama3/).
 *
 * https://www.substrate.run/nodes#Llama3Instruct70B
 */
declare class Llama3Instruct70B extends Node {
    /**
     * Input arguments: `prompt`, `system_prompt` (optional), `num_choices` (optional), `temperature` (optional), `frequency_penalty` (optional), `repetition_penalty` (optional), `presence_penalty` (optional), `top_p` (optional), `max_tokens` (optional)
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Llama3Instruct70B
     */
    constructor(args: FutureExpandAny<components["schemas"]["Llama3Instruct70BIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Llama3Instruct70B
     */
    protected result(): Promise<components["schemas"]["Llama3Instruct70BOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `choices`
     *
     * https://www.substrate.run/nodes#Llama3Instruct70B
     */
    get future(): Llama3Instruct70BOut;
    protected output(): components["schemas"]["Llama3Instruct70BOut"];
}
declare namespace Firellava13B {
    /**
     * Firellava13B Input
     * https://www.substrate.run/nodes#Firellava13B
     */
    type Input = FutureExpandAny<components["schemas"]["Firellava13BIn"]>;
    /**
     * Firellava13B Output
     * https://www.substrate.run/nodes#Firellava13B
     */
    type Output = components["schemas"]["Firellava13BOut"];
}
/**
 * Compute text with image input using [FireLLaVA 13B](https://fireworks.ai/blog/firellava-the-first-commercially-permissive-oss-llava-model).
 *
 * https://www.substrate.run/nodes#Firellava13B
 */
declare class Firellava13B extends Node {
    /**
     * Input arguments: `prompt`, `image_uris`, `max_tokens` (optional)
     *
     * Output fields: `text`
     *
     * https://www.substrate.run/nodes#Firellava13B
     */
    constructor(args: FutureExpandAny<components["schemas"]["Firellava13BIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `text`
     *
     * https://www.substrate.run/nodes#Firellava13B
     */
    protected result(): Promise<components["schemas"]["Firellava13BOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `text`
     *
     * https://www.substrate.run/nodes#Firellava13B
     */
    get future(): Firellava13BOut;
    protected output(): components["schemas"]["Firellava13BOut"];
}
declare namespace GenerateImage {
    /**
     * GenerateImage Input
     * https://www.substrate.run/nodes#GenerateImage
     */
    type Input = FutureExpandAny<components["schemas"]["GenerateImageIn"]>;
    /**
     * GenerateImage Output
     * https://www.substrate.run/nodes#GenerateImage
     */
    type Output = components["schemas"]["GenerateImageOut"];
}
/**
 * Generate an image.
 *
 * https://www.substrate.run/nodes#GenerateImage
 */
declare class GenerateImage extends Node {
    /**
     * Input arguments: `prompt`, `store` (optional)
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#GenerateImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["GenerateImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#GenerateImage
     */
    protected result(): Promise<components["schemas"]["GenerateImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#GenerateImage
     */
    get future(): GenerateImageOut;
    protected output(): components["schemas"]["GenerateImageOut"];
}
declare namespace MultiGenerateImage {
    /**
     * MultiGenerateImage Input
     * https://www.substrate.run/nodes#MultiGenerateImage
     */
    type Input = FutureExpandAny<components["schemas"]["MultiGenerateImageIn"]>;
    /**
     * MultiGenerateImage Output
     * https://www.substrate.run/nodes#MultiGenerateImage
     */
    type Output = components["schemas"]["MultiGenerateImageOut"];
}
/**
 * Generate multiple images.
 *
 * https://www.substrate.run/nodes#MultiGenerateImage
 */
declare class MultiGenerateImage extends Node {
    /**
     * Input arguments: `prompt`, `num_images`, `store` (optional)
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#MultiGenerateImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["MultiGenerateImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#MultiGenerateImage
     */
    protected result(): Promise<components["schemas"]["MultiGenerateImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#MultiGenerateImage
     */
    get future(): MultiGenerateImageOut;
    protected output(): components["schemas"]["MultiGenerateImageOut"];
}
declare namespace InpaintImage {
    /**
     * InpaintImage Input
     * https://www.substrate.run/nodes#InpaintImage
     */
    type Input = FutureExpandAny<components["schemas"]["InpaintImageIn"]>;
    /**
     * InpaintImage Output
     * https://www.substrate.run/nodes#InpaintImage
     */
    type Output = components["schemas"]["InpaintImageOut"];
}
/**
 * Edit an image using image generation inside part of the image or the full image.
 *
 * https://www.substrate.run/nodes#InpaintImage
 */
declare class InpaintImage extends Node {
    /**
     * Input arguments: `image_uri`, `prompt`, `mask_image_uri` (optional), `store` (optional)
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#InpaintImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["InpaintImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#InpaintImage
     */
    protected result(): Promise<components["schemas"]["InpaintImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#InpaintImage
     */
    get future(): InpaintImageOut;
    protected output(): components["schemas"]["InpaintImageOut"];
}
declare namespace MultiInpaintImage {
    /**
     * MultiInpaintImage Input
     * https://www.substrate.run/nodes#MultiInpaintImage
     */
    type Input = FutureExpandAny<components["schemas"]["MultiInpaintImageIn"]>;
    /**
     * MultiInpaintImage Output
     * https://www.substrate.run/nodes#MultiInpaintImage
     */
    type Output = components["schemas"]["MultiInpaintImageOut"];
}
/**
 * Edit multiple images using image generation.
 *
 * https://www.substrate.run/nodes#MultiInpaintImage
 */
declare class MultiInpaintImage extends Node {
    /**
     * Input arguments: `image_uri`, `prompt`, `mask_image_uri` (optional), `num_images`, `store` (optional)
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#MultiInpaintImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["MultiInpaintImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#MultiInpaintImage
     */
    protected result(): Promise<components["schemas"]["MultiInpaintImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#MultiInpaintImage
     */
    get future(): MultiInpaintImageOut;
    protected output(): components["schemas"]["MultiInpaintImageOut"];
}
declare namespace StableDiffusionXLLightning {
    /**
     * StableDiffusionXLLightning Input
     * https://www.substrate.run/nodes#StableDiffusionXLLightning
     */
    type Input = FutureExpandAny<components["schemas"]["StableDiffusionXLLightningIn"]>;
    /**
     * StableDiffusionXLLightning Output
     * https://www.substrate.run/nodes#StableDiffusionXLLightning
     */
    type Output = components["schemas"]["StableDiffusionXLLightningOut"];
}
/**
 * Generate an image using [Stable Diffusion XL Lightning](https://arxiv.org/abs/2402.13929).
 *
 * https://www.substrate.run/nodes#StableDiffusionXLLightning
 */
declare class StableDiffusionXLLightning extends Node {
    /**
     * Input arguments: `prompt`, `negative_prompt` (optional), `num_images` (optional), `store` (optional), `height` (optional), `width` (optional), `seeds` (optional)
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLLightning
     */
    constructor(args: FutureExpandAny<components["schemas"]["StableDiffusionXLLightningIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLLightning
     */
    protected result(): Promise<components["schemas"]["StableDiffusionXLLightningOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLLightning
     */
    get future(): StableDiffusionXLLightningOut;
    protected output(): components["schemas"]["StableDiffusionXLLightningOut"];
}
declare namespace StableDiffusionXLInpaint {
    /**
     * StableDiffusionXLInpaint Input
     * https://www.substrate.run/nodes#StableDiffusionXLInpaint
     */
    type Input = FutureExpandAny<components["schemas"]["StableDiffusionXLInpaintIn"]>;
    /**
     * StableDiffusionXLInpaint Output
     * https://www.substrate.run/nodes#StableDiffusionXLInpaint
     */
    type Output = components["schemas"]["StableDiffusionXLInpaintOut"];
}
/**
 * Edit an image using [Stable Diffusion XL](https://arxiv.org/abs/2307.01952). Supports inpainting (edit part of the image with a mask) and image-to-image (edit the full image).
 *
 * https://www.substrate.run/nodes#StableDiffusionXLInpaint
 */
declare class StableDiffusionXLInpaint extends Node {
    /**
     * Input arguments: `image_uri`, `prompt`, `mask_image_uri` (optional), `num_images`, `output_resolution` (optional), `negative_prompt` (optional), `store` (optional), `strength` (optional), `seeds` (optional)
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLInpaint
     */
    constructor(args: FutureExpandAny<components["schemas"]["StableDiffusionXLInpaintIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLInpaint
     */
    protected result(): Promise<components["schemas"]["StableDiffusionXLInpaintOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLInpaint
     */
    get future(): StableDiffusionXLInpaintOut;
    protected output(): components["schemas"]["StableDiffusionXLInpaintOut"];
}
declare namespace StableDiffusionXLControlNet {
    /**
     * StableDiffusionXLControlNet Input
     * https://www.substrate.run/nodes#StableDiffusionXLControlNet
     */
    type Input = FutureExpandAny<components["schemas"]["StableDiffusionXLControlNetIn"]>;
    /**
     * StableDiffusionXLControlNet Output
     * https://www.substrate.run/nodes#StableDiffusionXLControlNet
     */
    type Output = components["schemas"]["StableDiffusionXLControlNetOut"];
}
/**
 * Generate an image with generation structured by an input image, using Stable Diffusion XL with [ControlNet](https://arxiv.org/abs/2302.05543).
 *
 * https://www.substrate.run/nodes#StableDiffusionXLControlNet
 */
declare class StableDiffusionXLControlNet extends Node {
    /**
     * Input arguments: `image_uri`, `control_method`, `prompt`, `num_images`, `output_resolution` (optional), `negative_prompt` (optional), `store` (optional), `conditioning_scale` (optional), `strength` (optional), `seeds` (optional)
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLControlNet
     */
    constructor(args: FutureExpandAny<components["schemas"]["StableDiffusionXLControlNetIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLControlNet
     */
    protected result(): Promise<components["schemas"]["StableDiffusionXLControlNetOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `outputs`
     *
     * https://www.substrate.run/nodes#StableDiffusionXLControlNet
     */
    get future(): StableDiffusionXLControlNetOut;
    protected output(): components["schemas"]["StableDiffusionXLControlNetOut"];
}
declare namespace StableVideoDiffusion {
    /**
     * StableVideoDiffusion Input
     * https://www.substrate.run/nodes#StableVideoDiffusion
     */
    type Input = FutureExpandAny<components["schemas"]["StableVideoDiffusionIn"]>;
    /**
     * StableVideoDiffusion Output
     * https://www.substrate.run/nodes#StableVideoDiffusion
     */
    type Output = components["schemas"]["StableVideoDiffusionOut"];
}
/**
 * Generates a video using a still image as conditioning frame.
 *
 * https://www.substrate.run/nodes#StableVideoDiffusion
 */
declare class StableVideoDiffusion extends Node {
    /**
     * Input arguments: `image_uri`, `store` (optional), `output_format` (optional), `seed` (optional), `fps` (optional), `motion_bucket_id` (optional), `noise` (optional)
     *
     * Output fields: `video_uri` (optional), `frame_uris` (optional)
     *
     * https://www.substrate.run/nodes#StableVideoDiffusion
     */
    constructor(args: FutureExpandAny<components["schemas"]["StableVideoDiffusionIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `video_uri` (optional), `frame_uris` (optional)
     *
     * https://www.substrate.run/nodes#StableVideoDiffusion
     */
    protected result(): Promise<components["schemas"]["StableVideoDiffusionOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `video_uri` (optional), `frame_uris` (optional)
     *
     * https://www.substrate.run/nodes#StableVideoDiffusion
     */
    get future(): StableVideoDiffusionOut;
    protected output(): components["schemas"]["StableVideoDiffusionOut"];
}
declare namespace InterpolateFrames {
    /**
     * InterpolateFrames Input
     * https://www.substrate.run/nodes#InterpolateFrames
     */
    type Input = FutureExpandAny<components["schemas"]["InterpolateFramesIn"]>;
    /**
     * InterpolateFrames Output
     * https://www.substrate.run/nodes#InterpolateFrames
     */
    type Output = components["schemas"]["InterpolateFramesOut"];
}
/**
 * Generates a interpolation frames between each adjacent frames.
 *
 * https://www.substrate.run/nodes#InterpolateFrames
 */
declare class InterpolateFrames extends Node {
    /**
     * Input arguments: `frame_uris`, `store` (optional), `output_format` (optional), `fps` (optional), `num_steps` (optional)
     *
     * Output fields: `video_uri` (optional), `frame_uris` (optional)
     *
     * https://www.substrate.run/nodes#InterpolateFrames
     */
    constructor(args: FutureExpandAny<components["schemas"]["InterpolateFramesIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `video_uri` (optional), `frame_uris` (optional)
     *
     * https://www.substrate.run/nodes#InterpolateFrames
     */
    protected result(): Promise<components["schemas"]["InterpolateFramesOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `video_uri` (optional), `frame_uris` (optional)
     *
     * https://www.substrate.run/nodes#InterpolateFrames
     */
    get future(): InterpolateFramesOut;
    protected output(): components["schemas"]["InterpolateFramesOut"];
}
declare namespace TranscribeSpeech {
    /**
     * TranscribeSpeech Input
     * https://www.substrate.run/nodes#TranscribeSpeech
     */
    type Input = FutureExpandAny<components["schemas"]["TranscribeSpeechIn"]>;
    /**
     * TranscribeSpeech Output
     * https://www.substrate.run/nodes#TranscribeSpeech
     */
    type Output = components["schemas"]["TranscribeSpeechOut"];
}
/**
 * Transcribe speech in an audio or video file.
 *
 * https://www.substrate.run/nodes#TranscribeSpeech
 */
declare class TranscribeSpeech extends Node {
    /**
     * Input arguments: `audio_uri`, `prompt` (optional), `language` (optional), `segment` (optional), `align` (optional), `diarize` (optional), `suggest_chapters` (optional)
     *
     * Output fields: `text`, `segments` (optional), `chapters` (optional)
     *
     * https://www.substrate.run/nodes#TranscribeSpeech
     */
    constructor(args: FutureExpandAny<components["schemas"]["TranscribeSpeechIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `text`, `segments` (optional), `chapters` (optional)
     *
     * https://www.substrate.run/nodes#TranscribeSpeech
     */
    protected result(): Promise<components["schemas"]["TranscribeSpeechOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `text`, `segments` (optional), `chapters` (optional)
     *
     * https://www.substrate.run/nodes#TranscribeSpeech
     */
    get future(): TranscribeSpeechOut;
    protected output(): components["schemas"]["TranscribeSpeechOut"];
}
declare namespace GenerateSpeech {
    /**
     * GenerateSpeech Input
     * https://www.substrate.run/nodes#GenerateSpeech
     */
    type Input = FutureExpandAny<components["schemas"]["GenerateSpeechIn"]>;
    /**
     * GenerateSpeech Output
     * https://www.substrate.run/nodes#GenerateSpeech
     */
    type Output = components["schemas"]["GenerateSpeechOut"];
}
/**
 * Generate speech from text.
 *
 * https://www.substrate.run/nodes#GenerateSpeech
 */
declare class GenerateSpeech extends Node {
    /**
     * Input arguments: `text`, `store` (optional)
     *
     * Output fields: `audio_uri`
     *
     * https://www.substrate.run/nodes#GenerateSpeech
     */
    constructor(args: FutureExpandAny<components["schemas"]["GenerateSpeechIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `audio_uri`
     *
     * https://www.substrate.run/nodes#GenerateSpeech
     */
    protected result(): Promise<components["schemas"]["GenerateSpeechOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `audio_uri`
     *
     * https://www.substrate.run/nodes#GenerateSpeech
     */
    get future(): GenerateSpeechOut;
    protected output(): components["schemas"]["GenerateSpeechOut"];
}
declare namespace RemoveBackground {
    /**
     * RemoveBackground Input
     * https://www.substrate.run/nodes#RemoveBackground
     */
    type Input = FutureExpandAny<components["schemas"]["RemoveBackgroundIn"]>;
    /**
     * RemoveBackground Output
     * https://www.substrate.run/nodes#RemoveBackground
     */
    type Output = components["schemas"]["RemoveBackgroundOut"];
}
/**
 * Remove the background from an image and return the foreground segment as a cut-out or a mask.
 *
 * https://www.substrate.run/nodes#RemoveBackground
 */
declare class RemoveBackground extends Node {
    /**
     * Input arguments: `image_uri`, `return_mask` (optional), `invert_mask` (optional), `background_color` (optional), `store` (optional)
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#RemoveBackground
     */
    constructor(args: FutureExpandAny<components["schemas"]["RemoveBackgroundIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#RemoveBackground
     */
    protected result(): Promise<components["schemas"]["RemoveBackgroundOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#RemoveBackground
     */
    get future(): RemoveBackgroundOut;
    protected output(): components["schemas"]["RemoveBackgroundOut"];
}
declare namespace EraseImage {
    /**
     * EraseImage Input
     * https://www.substrate.run/nodes#EraseImage
     */
    type Input = FutureExpandAny<components["schemas"]["EraseImageIn"]>;
    /**
     * EraseImage Output
     * https://www.substrate.run/nodes#EraseImage
     */
    type Output = components["schemas"]["EraseImageOut"];
}
/**
 * Erase the masked part of an image, e.g. to remove an object by inpainting.
 *
 * https://www.substrate.run/nodes#EraseImage
 */
declare class EraseImage extends Node {
    /**
     * Input arguments: `image_uri`, `mask_image_uri`, `store` (optional)
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#EraseImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["EraseImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#EraseImage
     */
    protected result(): Promise<components["schemas"]["EraseImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#EraseImage
     */
    get future(): EraseImageOut;
    protected output(): components["schemas"]["EraseImageOut"];
}
declare namespace UpscaleImage {
    /**
     * UpscaleImage Input
     * https://www.substrate.run/nodes#UpscaleImage
     */
    type Input = FutureExpandAny<components["schemas"]["UpscaleImageIn"]>;
    /**
     * UpscaleImage Output
     * https://www.substrate.run/nodes#UpscaleImage
     */
    type Output = components["schemas"]["UpscaleImageOut"];
}
/**
 * Upscale an image using image generation.
 *
 * https://www.substrate.run/nodes#UpscaleImage
 */
declare class UpscaleImage extends Node {
    /**
     * Input arguments: `prompt` (optional), `image_uri`, `output_resolution` (optional), `store` (optional)
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#UpscaleImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["UpscaleImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#UpscaleImage
     */
    protected result(): Promise<components["schemas"]["UpscaleImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `image_uri`
     *
     * https://www.substrate.run/nodes#UpscaleImage
     */
    get future(): UpscaleImageOut;
    protected output(): components["schemas"]["UpscaleImageOut"];
}
declare namespace SegmentUnderPoint {
    /**
     * SegmentUnderPoint Input
     * https://www.substrate.run/nodes#SegmentUnderPoint
     */
    type Input = FutureExpandAny<components["schemas"]["SegmentUnderPointIn"]>;
    /**
     * SegmentUnderPoint Output
     * https://www.substrate.run/nodes#SegmentUnderPoint
     */
    type Output = components["schemas"]["SegmentUnderPointOut"];
}
/**
 * Segment an image under a point and return the segment.
 *
 * https://www.substrate.run/nodes#SegmentUnderPoint
 */
declare class SegmentUnderPoint extends Node {
    /**
     * Input arguments: `image_uri`, `point`, `store` (optional)
     *
     * Output fields: `mask_image_uri`
     *
     * https://www.substrate.run/nodes#SegmentUnderPoint
     */
    constructor(args: FutureExpandAny<components["schemas"]["SegmentUnderPointIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `mask_image_uri`
     *
     * https://www.substrate.run/nodes#SegmentUnderPoint
     */
    protected result(): Promise<components["schemas"]["SegmentUnderPointOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `mask_image_uri`
     *
     * https://www.substrate.run/nodes#SegmentUnderPoint
     */
    get future(): SegmentUnderPointOut;
    protected output(): components["schemas"]["SegmentUnderPointOut"];
}
declare namespace SegmentAnything {
    /**
     * SegmentAnything Input
     * https://www.substrate.run/nodes#SegmentAnything
     */
    type Input = FutureExpandAny<components["schemas"]["SegmentAnythingIn"]>;
    /**
     * SegmentAnything Output
     * https://www.substrate.run/nodes#SegmentAnything
     */
    type Output = components["schemas"]["SegmentAnythingOut"];
}
/**
 * Segment an image using [SegmentAnything](https://github.com/facebookresearch/segment-anything).
 *
 * https://www.substrate.run/nodes#SegmentAnything
 */
declare class SegmentAnything extends Node {
    /**
     * Input arguments: `image_uri`, `point_prompts` (optional), `box_prompts` (optional), `store` (optional)
     *
     * Output fields: `mask_image_uri`
     *
     * https://www.substrate.run/nodes#SegmentAnything
     */
    constructor(args: FutureExpandAny<components["schemas"]["SegmentAnythingIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `mask_image_uri`
     *
     * https://www.substrate.run/nodes#SegmentAnything
     */
    protected result(): Promise<components["schemas"]["SegmentAnythingOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `mask_image_uri`
     *
     * https://www.substrate.run/nodes#SegmentAnything
     */
    get future(): SegmentAnythingOut;
    protected output(): components["schemas"]["SegmentAnythingOut"];
}
declare namespace SplitDocument {
    /**
     * SplitDocument Input
     * https://www.substrate.run/nodes#SplitDocument
     */
    type Input = FutureExpandAny<components["schemas"]["SplitDocumentIn"]>;
    /**
     * SplitDocument Output
     * https://www.substrate.run/nodes#SplitDocument
     */
    type Output = components["schemas"]["SplitDocumentOut"];
}
/**
 * Split document into text segments.
 *
 * https://www.substrate.run/nodes#SplitDocument
 */
declare class SplitDocument extends Node {
    /**
     * Input arguments: `uri`, `doc_id` (optional), `metadata` (optional), `chunk_size` (optional), `chunk_overlap` (optional)
     *
     * Output fields: `items`
     *
     * https://www.substrate.run/nodes#SplitDocument
     */
    constructor(args: FutureExpandAny<components["schemas"]["SplitDocumentIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `items`
     *
     * https://www.substrate.run/nodes#SplitDocument
     */
    protected result(): Promise<components["schemas"]["SplitDocumentOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `items`
     *
     * https://www.substrate.run/nodes#SplitDocument
     */
    get future(): SplitDocumentOut;
    protected output(): components["schemas"]["SplitDocumentOut"];
}
declare namespace EmbedText {
    /**
     * EmbedText Input
     * https://www.substrate.run/nodes#EmbedText
     */
    type Input = FutureExpandAny<components["schemas"]["EmbedTextIn"]>;
    /**
     * EmbedText Output
     * https://www.substrate.run/nodes#EmbedText
     */
    type Output = components["schemas"]["EmbedTextOut"];
}
/**
 * Generate embedding for a text document.
 *
 * https://www.substrate.run/nodes#EmbedText
 */
declare class EmbedText extends Node {
    /**
     * Input arguments: `text`, `collection_name` (optional), `metadata` (optional), `embedded_metadata_keys` (optional), `doc_id` (optional), `model` (optional)
     *
     * Output fields: `embedding`
     *
     * https://www.substrate.run/nodes#EmbedText
     */
    constructor(args: FutureExpandAny<components["schemas"]["EmbedTextIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `embedding`
     *
     * https://www.substrate.run/nodes#EmbedText
     */
    protected result(): Promise<components["schemas"]["EmbedTextOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `embedding`
     *
     * https://www.substrate.run/nodes#EmbedText
     */
    get future(): EmbedTextOut;
    protected output(): components["schemas"]["EmbedTextOut"];
}
declare namespace MultiEmbedText {
    /**
     * MultiEmbedText Input
     * https://www.substrate.run/nodes#MultiEmbedText
     */
    type Input = FutureExpandAny<components["schemas"]["MultiEmbedTextIn"]>;
    /**
     * MultiEmbedText Output
     * https://www.substrate.run/nodes#MultiEmbedText
     */
    type Output = components["schemas"]["MultiEmbedTextOut"];
}
/**
 * Generate embeddings for multiple text documents.
 *
 * https://www.substrate.run/nodes#MultiEmbedText
 */
declare class MultiEmbedText extends Node {
    /**
     * Input arguments: `items`, `collection_name` (optional), `embedded_metadata_keys` (optional), `model` (optional)
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#MultiEmbedText
     */
    constructor(args: FutureExpandAny<components["schemas"]["MultiEmbedTextIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#MultiEmbedText
     */
    protected result(): Promise<components["schemas"]["MultiEmbedTextOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#MultiEmbedText
     */
    get future(): MultiEmbedTextOut;
    protected output(): components["schemas"]["MultiEmbedTextOut"];
}
declare namespace EmbedImage {
    /**
     * EmbedImage Input
     * https://www.substrate.run/nodes#EmbedImage
     */
    type Input = FutureExpandAny<components["schemas"]["EmbedImageIn"]>;
    /**
     * EmbedImage Output
     * https://www.substrate.run/nodes#EmbedImage
     */
    type Output = components["schemas"]["EmbedImageOut"];
}
/**
 * Generate embedding for an image.
 *
 * https://www.substrate.run/nodes#EmbedImage
 */
declare class EmbedImage extends Node {
    /**
     * Input arguments: `image_uri`, `collection_name` (optional), `doc_id` (optional), `model` (optional)
     *
     * Output fields: `embedding`
     *
     * https://www.substrate.run/nodes#EmbedImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["EmbedImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `embedding`
     *
     * https://www.substrate.run/nodes#EmbedImage
     */
    protected result(): Promise<components["schemas"]["EmbedImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `embedding`
     *
     * https://www.substrate.run/nodes#EmbedImage
     */
    get future(): EmbedImageOut;
    protected output(): components["schemas"]["EmbedImageOut"];
}
declare namespace MultiEmbedImage {
    /**
     * MultiEmbedImage Input
     * https://www.substrate.run/nodes#MultiEmbedImage
     */
    type Input = FutureExpandAny<components["schemas"]["MultiEmbedImageIn"]>;
    /**
     * MultiEmbedImage Output
     * https://www.substrate.run/nodes#MultiEmbedImage
     */
    type Output = components["schemas"]["MultiEmbedImageOut"];
}
/**
 * Generate embeddings for multiple images.
 *
 * https://www.substrate.run/nodes#MultiEmbedImage
 */
declare class MultiEmbedImage extends Node {
    /**
     * Input arguments: `items`, `collection_name` (optional), `model` (optional)
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#MultiEmbedImage
     */
    constructor(args: FutureExpandAny<components["schemas"]["MultiEmbedImageIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#MultiEmbedImage
     */
    protected result(): Promise<components["schemas"]["MultiEmbedImageOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#MultiEmbedImage
     */
    get future(): MultiEmbedImageOut;
    protected output(): components["schemas"]["MultiEmbedImageOut"];
}
declare namespace JinaV2 {
    /**
     * JinaV2 Input
     * https://www.substrate.run/nodes#JinaV2
     */
    type Input = FutureExpandAny<components["schemas"]["JinaV2In"]>;
    /**
     * JinaV2 Output
     * https://www.substrate.run/nodes#JinaV2
     */
    type Output = components["schemas"]["JinaV2Out"];
}
/**
 * Generate embeddings for multiple text documents using [Jina Embeddings 2](https://arxiv.org/abs/2310.19923).
 *
 * https://www.substrate.run/nodes#JinaV2
 */
declare class JinaV2 extends Node {
    /**
     * Input arguments: `items`, `collection_name` (optional), `embedded_metadata_keys` (optional)
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#JinaV2
     */
    constructor(args: FutureExpandAny<components["schemas"]["JinaV2In"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#JinaV2
     */
    protected result(): Promise<components["schemas"]["JinaV2Out"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#JinaV2
     */
    get future(): JinaV2Out;
    protected output(): components["schemas"]["JinaV2Out"];
}
declare namespace CLIP {
    /**
     * CLIP Input
     * https://www.substrate.run/nodes#CLIP
     */
    type Input = FutureExpandAny<components["schemas"]["CLIPIn"]>;
    /**
     * CLIP Output
     * https://www.substrate.run/nodes#CLIP
     */
    type Output = components["schemas"]["CLIPOut"];
}
/**
 * Generate embeddings for text or images using [CLIP](https://openai.com/research/clip).
 *
 * https://www.substrate.run/nodes#CLIP
 */
declare class CLIP extends Node {
    /**
     * Input arguments: `items`, `collection_name` (optional), `embedded_metadata_keys` (optional)
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#CLIP
     */
    constructor(args: FutureExpandAny<components["schemas"]["CLIPIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#CLIP
     */
    protected result(): Promise<components["schemas"]["CLIPOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `embeddings`
     *
     * https://www.substrate.run/nodes#CLIP
     */
    get future(): CLIPOut;
    protected output(): components["schemas"]["CLIPOut"];
}
declare namespace FindOrCreateVectorStore {
    /**
     * FindOrCreateVectorStore Input
     * https://www.substrate.run/nodes#FindOrCreateVectorStore
     */
    type Input = FutureExpandAny<components["schemas"]["FindOrCreateVectorStoreIn"]>;
    /**
     * FindOrCreateVectorStore Output
     * https://www.substrate.run/nodes#FindOrCreateVectorStore
     */
    type Output = components["schemas"]["FindOrCreateVectorStoreOut"];
}
/**
 * Find a vector store matching the given collection name, or create a new vector store.
 *
 * https://www.substrate.run/nodes#FindOrCreateVectorStore
 */
declare class FindOrCreateVectorStore extends Node {
    /**
     * Input arguments: `collection_name`, `model`
     *
     * Output fields: `collection_name`, `model`, `num_leaves` (optional)
     *
     * https://www.substrate.run/nodes#FindOrCreateVectorStore
     */
    constructor(args: FutureExpandAny<components["schemas"]["FindOrCreateVectorStoreIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `collection_name`, `model`, `num_leaves` (optional)
     *
     * https://www.substrate.run/nodes#FindOrCreateVectorStore
     */
    protected result(): Promise<components["schemas"]["FindOrCreateVectorStoreOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `collection_name`, `model`, `num_leaves` (optional)
     *
     * https://www.substrate.run/nodes#FindOrCreateVectorStore
     */
    get future(): FindOrCreateVectorStoreOut;
    protected output(): components["schemas"]["FindOrCreateVectorStoreOut"];
}
declare namespace ListVectorStores {
    /**
     * ListVectorStores Input
     * https://www.substrate.run/nodes#ListVectorStores
     */
    type Input = FutureExpandAny<components["schemas"]["ListVectorStoresIn"]>;
    /**
     * ListVectorStores Output
     * https://www.substrate.run/nodes#ListVectorStores
     */
    type Output = components["schemas"]["ListVectorStoresOut"];
}
/**
 * List all vector stores.
 *
 * https://www.substrate.run/nodes#ListVectorStores
 */
declare class ListVectorStores extends Node {
    /**
     * Input arguments:
     *
     * Output fields: `items` (optional)
     *
     * https://www.substrate.run/nodes#ListVectorStores
     */
    constructor(args: FutureExpandAny<components["schemas"]["ListVectorStoresIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `items` (optional)
     *
     * https://www.substrate.run/nodes#ListVectorStores
     */
    protected result(): Promise<components["schemas"]["ListVectorStoresOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `items` (optional)
     *
     * https://www.substrate.run/nodes#ListVectorStores
     */
    get future(): ListVectorStoresOut;
    protected output(): components["schemas"]["ListVectorStoresOut"];
}
declare namespace DeleteVectorStore {
    /**
     * DeleteVectorStore Input
     * https://www.substrate.run/nodes#DeleteVectorStore
     */
    type Input = FutureExpandAny<components["schemas"]["DeleteVectorStoreIn"]>;
    /**
     * DeleteVectorStore Output
     * https://www.substrate.run/nodes#DeleteVectorStore
     */
    type Output = components["schemas"]["DeleteVectorStoreOut"];
}
/**
 * Delete a vector store.
 *
 * https://www.substrate.run/nodes#DeleteVectorStore
 */
declare class DeleteVectorStore extends Node {
    /**
     * Input arguments: `collection_name`, `model`
     *
     * Output fields: `collection_name`, `model`
     *
     * https://www.substrate.run/nodes#DeleteVectorStore
     */
    constructor(args: FutureExpandAny<components["schemas"]["DeleteVectorStoreIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `collection_name`, `model`
     *
     * https://www.substrate.run/nodes#DeleteVectorStore
     */
    protected result(): Promise<components["schemas"]["DeleteVectorStoreOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `collection_name`, `model`
     *
     * https://www.substrate.run/nodes#DeleteVectorStore
     */
    get future(): DeleteVectorStoreOut;
    protected output(): components["schemas"]["DeleteVectorStoreOut"];
}
declare namespace QueryVectorStore {
    /**
     * QueryVectorStore Input
     * https://www.substrate.run/nodes#QueryVectorStore
     */
    type Input = FutureExpandAny<components["schemas"]["QueryVectorStoreIn"]>;
    /**
     * QueryVectorStore Output
     * https://www.substrate.run/nodes#QueryVectorStore
     */
    type Output = components["schemas"]["QueryVectorStoreOut"];
}
/**
 * Query a vector store for similar vectors.
 *
 * https://www.substrate.run/nodes#QueryVectorStore
 */
declare class QueryVectorStore extends Node {
    /**
     * Input arguments: `collection_name`, `model`, `query_strings` (optional), `query_image_uris` (optional), `query_vectors` (optional), `query_ids` (optional), `top_k` (optional), `ef_search` (optional), `num_leaves_to_search` (optional), `include_values` (optional), `include_metadata` (optional), `filters` (optional)
     *
     * Output fields: `results`, `collection_name` (optional), `model` (optional)
     *
     * https://www.substrate.run/nodes#QueryVectorStore
     */
    constructor(args: FutureExpandAny<components["schemas"]["QueryVectorStoreIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `results`, `collection_name` (optional), `model` (optional)
     *
     * https://www.substrate.run/nodes#QueryVectorStore
     */
    protected result(): Promise<components["schemas"]["QueryVectorStoreOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `results`, `collection_name` (optional), `model` (optional)
     *
     * https://www.substrate.run/nodes#QueryVectorStore
     */
    get future(): QueryVectorStoreOut;
    protected output(): components["schemas"]["QueryVectorStoreOut"];
}
declare namespace FetchVectors {
    /**
     * FetchVectors Input
     * https://www.substrate.run/nodes#FetchVectors
     */
    type Input = FutureExpandAny<components["schemas"]["FetchVectorsIn"]>;
    /**
     * FetchVectors Output
     * https://www.substrate.run/nodes#FetchVectors
     */
    type Output = components["schemas"]["FetchVectorsOut"];
}
/**
 * Fetch vectors from a vector store.
 *
 * https://www.substrate.run/nodes#FetchVectors
 */
declare class FetchVectors extends Node {
    /**
     * Input arguments: `collection_name`, `model`, `ids`
     *
     * Output fields: `vectors`
     *
     * https://www.substrate.run/nodes#FetchVectors
     */
    constructor(args: FutureExpandAny<components["schemas"]["FetchVectorsIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `vectors`
     *
     * https://www.substrate.run/nodes#FetchVectors
     */
    protected result(): Promise<components["schemas"]["FetchVectorsOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `vectors`
     *
     * https://www.substrate.run/nodes#FetchVectors
     */
    get future(): FetchVectorsOut;
    protected output(): components["schemas"]["FetchVectorsOut"];
}
declare namespace UpdateVectors {
    /**
     * UpdateVectors Input
     * https://www.substrate.run/nodes#UpdateVectors
     */
    type Input = FutureExpandAny<components["schemas"]["UpdateVectorsIn"]>;
    /**
     * UpdateVectors Output
     * https://www.substrate.run/nodes#UpdateVectors
     */
    type Output = components["schemas"]["UpdateVectorsOut"];
}
/**
 * Update vectors in a vector store.
 *
 * https://www.substrate.run/nodes#UpdateVectors
 */
declare class UpdateVectors extends Node {
    /**
     * Input arguments: `collection_name`, `model`, `vectors`
     *
     * Output fields: `count`
     *
     * https://www.substrate.run/nodes#UpdateVectors
     */
    constructor(args: FutureExpandAny<components["schemas"]["UpdateVectorsIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `count`
     *
     * https://www.substrate.run/nodes#UpdateVectors
     */
    protected result(): Promise<components["schemas"]["UpdateVectorsOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `count`
     *
     * https://www.substrate.run/nodes#UpdateVectors
     */
    get future(): UpdateVectorsOut;
    protected output(): components["schemas"]["UpdateVectorsOut"];
}
declare namespace DeleteVectors {
    /**
     * DeleteVectors Input
     * https://www.substrate.run/nodes#DeleteVectors
     */
    type Input = FutureExpandAny<components["schemas"]["DeleteVectorsIn"]>;
    /**
     * DeleteVectors Output
     * https://www.substrate.run/nodes#DeleteVectors
     */
    type Output = components["schemas"]["DeleteVectorsOut"];
}
/**
 * Delete vectors in a vector store.
 *
 * https://www.substrate.run/nodes#DeleteVectors
 */
declare class DeleteVectors extends Node {
    /**
     * Input arguments: `collection_name`, `model`, `ids`
     *
     * Output fields: `count`
     *
     * https://www.substrate.run/nodes#DeleteVectors
     */
    constructor(args: FutureExpandAny<components["schemas"]["DeleteVectorsIn"]>, options?: Options);
    /**
     * Retrieve this node's output from a response.
     *
     * Output fields: `count`
     *
     * https://www.substrate.run/nodes#DeleteVectors
     */
    protected result(): Promise<components["schemas"]["DeleteVectorsOut"] | undefined>;
    /**
     * Future reference to this node's output.
     *
     * Output fields: `count`
     *
     * https://www.substrate.run/nodes#DeleteVectors
     */
    get future(): DeleteVectorsOut;
    protected output(): components["schemas"]["DeleteVectorsOut"];
}
type AnyNode = Experimental | Box | If | ComputeText | MultiComputeText | BatchComputeText | BatchComputeJSON | ComputeJSON | MultiComputeJSON | Mistral7BInstruct | Mixtral8x7BInstruct | Llama3Instruct8B | Llama3Instruct70B | Firellava13B | GenerateImage | MultiGenerateImage | InpaintImage | MultiInpaintImage | StableDiffusionXLLightning | StableDiffusionXLInpaint | StableDiffusionXLControlNet | StableVideoDiffusion | InterpolateFrames | TranscribeSpeech | GenerateSpeech | RemoveBackground | EraseImage | UpscaleImage | SegmentUnderPoint | SegmentAnything | SplitDocument | EmbedText | MultiEmbedText | EmbedImage | MultiEmbedImage | JinaV2 | CLIP | FindOrCreateVectorStore | ListVectorStores | DeleteVectorStore | QueryVectorStore | FetchVectors | UpdateVectors | DeleteVectors;
type NodeOutput<T> = T extends Experimental ? components["schemas"]["ExperimentalOut"] : T extends Box ? components["schemas"]["BoxOut"] : T extends If ? components["schemas"]["IfOut"] : T extends ComputeText ? components["schemas"]["ComputeTextOut"] : T extends MultiComputeText ? components["schemas"]["MultiComputeTextOut"] : T extends BatchComputeText ? components["schemas"]["BatchComputeTextOut"] : T extends BatchComputeJSON ? components["schemas"]["BatchComputeJSONOut"] : T extends ComputeJSON ? components["schemas"]["ComputeJSONOut"] : T extends MultiComputeJSON ? components["schemas"]["MultiComputeJSONOut"] : T extends Mistral7BInstruct ? components["schemas"]["Mistral7BInstructOut"] : T extends Mixtral8x7BInstruct ? components["schemas"]["Mixtral8x7BInstructOut"] : T extends Llama3Instruct8B ? components["schemas"]["Llama3Instruct8BOut"] : T extends Llama3Instruct70B ? components["schemas"]["Llama3Instruct70BOut"] : T extends Firellava13B ? components["schemas"]["Firellava13BOut"] : T extends GenerateImage ? components["schemas"]["GenerateImageOut"] : T extends MultiGenerateImage ? components["schemas"]["MultiGenerateImageOut"] : T extends InpaintImage ? components["schemas"]["InpaintImageOut"] : T extends MultiInpaintImage ? components["schemas"]["MultiInpaintImageOut"] : T extends StableDiffusionXLLightning ? components["schemas"]["StableDiffusionXLLightningOut"] : T extends StableDiffusionXLInpaint ? components["schemas"]["StableDiffusionXLInpaintOut"] : T extends StableDiffusionXLControlNet ? components["schemas"]["StableDiffusionXLControlNetOut"] : T extends StableVideoDiffusion ? components["schemas"]["StableVideoDiffusionOut"] : T extends InterpolateFrames ? components["schemas"]["InterpolateFramesOut"] : T extends TranscribeSpeech ? components["schemas"]["TranscribeSpeechOut"] : T extends GenerateSpeech ? components["schemas"]["GenerateSpeechOut"] : T extends RemoveBackground ? components["schemas"]["RemoveBackgroundOut"] : T extends EraseImage ? components["schemas"]["EraseImageOut"] : T extends UpscaleImage ? components["schemas"]["UpscaleImageOut"] : T extends SegmentUnderPoint ? components["schemas"]["SegmentUnderPointOut"] : T extends SegmentAnything ? components["schemas"]["SegmentAnythingOut"] : T extends SplitDocument ? components["schemas"]["SplitDocumentOut"] : T extends EmbedText ? components["schemas"]["EmbedTextOut"] : T extends MultiEmbedText ? components["schemas"]["MultiEmbedTextOut"] : T extends EmbedImage ? components["schemas"]["EmbedImageOut"] : T extends MultiEmbedImage ? components["schemas"]["MultiEmbedImageOut"] : T extends JinaV2 ? components["schemas"]["JinaV2Out"] : T extends CLIP ? components["schemas"]["CLIPOut"] : T extends FindOrCreateVectorStore ? components["schemas"]["FindOrCreateVectorStoreOut"] : T extends ListVectorStores ? components["schemas"]["ListVectorStoresOut"] : T extends DeleteVectorStore ? components["schemas"]["DeleteVectorStoreOut"] : T extends QueryVectorStore ? components["schemas"]["QueryVectorStoreOut"] : T extends FetchVectors ? components["schemas"]["FetchVectorsOut"] : T extends UpdateVectors ? components["schemas"]["UpdateVectorsOut"] : T extends DeleteVectors ? components["schemas"]["DeleteVectorsOut"] : never;

/** Represents an array item within a `Node` output chunk, specifies the field is an array containing this `item` at the `index`. **/
type ChunkArrayItem<T = Object> = {
    object: "array.item";
    index: number;
    item: T;
};
/** Helper types for producing the "Chunk" types used in the `NodeDelta` messages */
type ChunkizeObject<T> = T extends object ? {
    [P in keyof T]: ChunkizeAny<T[P]>;
} : T;
type ChunkizeArray<T> = T extends (infer U)[] ? ChunkArrayItem<ChunkizeAny<U>> : ChunkArrayItem<T>;
type ChunkizeAny<T> = T extends (infer U)[] ? ChunkizeArray<U> : T extends object ? ChunkizeObject<T> : T;
/** Stream message that contains the completed `Node` output */
type NodeResult<T = Object> = {
    object: "node.result";
    nodeId: string;
    data: T;
};
/** Stream message that contains a chunk of the `Node` output */
type NodeDelta<T = Object> = {
    object: "node.delta";
    nodeId: string;
    data: ChunkizeAny<T>;
};
/** Stream message when an error happened during a `Node` run. */
type NodeError = {
    object: "node.error";
    nodeId: string;
    data: {
        type: string;
        message: string;
    };
};
type NodeMessage<T = Object> = NodeResult<T> | NodeDelta<T> | NodeError;

/**
 * `StreamingResponse` is an async iterator that is used to interact with a stream of Server-Sent Events
 */
declare class StreamingResponse {
    apiResponse: Response;
    iterator: any;
    constructor(response: Response, iterator: any);
    [Symbol.asyncIterator](): any;
    tee(n?: number): StreamingResponse[];
    static fromReponse(response: Response): Promise<StreamingResponse>;
}
/**
 * `SubstrateStreamingResponse`
 */
declare class SubstrateStreamingResponse extends StreamingResponse {
    apiRequest: Request;
    constructor(request: Request, response: Response, iterator: any);
    get<T extends AnyNode>(node: T): AsyncGenerator<NodeMessage<NodeOutput<T>>>;
    tee(n?: number): SubstrateStreamingResponse[];
    static fromRequestReponse(request: Request, response: Response): Promise<SubstrateStreamingResponse>;
}

declare const sb: {
    concat: typeof FutureString.concat;
    jq: typeof Future.jq;
    interpolate: typeof FutureString.interpolate;
    streaming: {
        fromSSEResponse: typeof StreamingResponse.fromReponse;
    };
};

type Configuration = {
    /**
     * [docs/authentication](https://docs.substrate.run/#authentication)
     */
    apiKey: string | undefined;
    /**
     * [docs/versioning](https://docs.substrate.run/versioning)
     */
    apiVersion?: string | undefined;
    baseUrl?: string;
    /**
     * Request timeout in milliseconds. Default: 5m
     */
    timeout?: number;
    /**
     * Secrets for third party services.
     */
    secrets?: Secrets;
    /**
     * Add additional headers to each request. These may override headers set by the Substrate client.
     */
    additionalHeaders?: Record<string, string>;
};
type Secrets = {
    openai?: string;
    anthropic?: string;
};
/**
 * [docs/introduction](https://docs.substrate.run)
 */
declare class Substrate {
    apiKey: Configuration["apiKey"];
    baseUrl: NonNullable<Configuration["baseUrl"]>;
    apiVersion: NonNullable<Configuration["apiVersion"]>;
    timeout: NonNullable<Configuration["timeout"]>;
    additionalHeaders: NonNullable<Configuration["additionalHeaders"]>;
    /**
     * Initialize the Substrate SDK.
     */
    constructor({ apiKey, baseUrl, apiVersion, timeout, secrets, additionalHeaders, }: Configuration);
    /**
     *  Run the given nodes.
     *
     *  @throws {SubstrateError} when the server response is an error.
     *  @throws {RequestTimeoutError} when the client has timed out (Configured by `Substrate.timeout`).
     *  @throws {Error} when the client encounters an error making the request.
     */
    run(...nodes: Node[]): Promise<SubstrateResponse>;
    /**
     *  Stream the given nodes.
     */
    stream(...nodes: Node[]): Promise<SubstrateStreamingResponse>;
    /**
     *  Run the given nodes, serialized using `Substrate.serialize`.
     *
     *  @throws {SubstrateError} when the server response is an error.
     *  @throws {RequestTimeoutError} when the client has timed out (Configured by `Substrate.timeout`).
     *  @throws {Error} when the client encounters an error making the request.
     */
    runSerialized(nodes: Node[], endpoint?: string): Promise<SubstrateResponse>;
    /**
     *  Stream the given nodes, serialized using `Substrate.serialize`.
     */
    streamSerialized(serialized: any, endpoint?: string): Promise<SubstrateStreamingResponse>;
    /**
     *  Return a set of all nodes and their dependent nodes.
     */
    static findAllNodes(fromNodes: Node[]): Set<Node>;
    /**
     *  Return a set of all futures and their dependent futures.
     */
    static findAllFutures(fromNodes: Node[]): Set<Future<any>>;
    /**
     *  Transform an array of nodes into JSON for the Substrate API
     */
    static serialize(...nodes: Node[]): any;
    /**
     *  Returns a url to visualize the given nodes.
     */
    static visualize(...nodes: Node[]): string;
    protected requestOptions(body: any, signal: AbortSignal): {
        method: string;
        headers: Headers;
        body: string;
        signal: AbortSignal;
    };
    protected headers(): Headers;
}

export { BatchComputeJSON, BatchComputeText, Box, CLIP, ComputeJSON, ComputeText, DeleteVectorStore, DeleteVectors, EmbedImage, EmbedText, EraseImage, Experimental, FetchVectors, FindOrCreateVectorStore, Firellava13B, GenerateImage, GenerateSpeech, If, InpaintImage, InterpolateFrames, JinaV2, ListVectorStores, Llama3Instruct70B, Llama3Instruct8B, Mistral7BInstruct, Mixtral8x7BInstruct, MultiComputeJSON, MultiComputeText, MultiEmbedImage, MultiEmbedText, MultiGenerateImage, MultiInpaintImage, QueryVectorStore, RemoveBackground, SegmentAnything, SegmentUnderPoint, SplitDocument, StableDiffusionXLControlNet, StableDiffusionXLInpaint, StableDiffusionXLLightning, StableVideoDiffusion, Substrate, SubstrateError, TranscribeSpeech, UpdateVectors, UpscaleImage, sb };
