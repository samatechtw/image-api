mod utils;

use std::fs;
use std::io::Cursor;
use std::panic;
use image::{ImageFormat, ImageOutputFormat};
use image::imageops::FilterType;
use wasm_bindgen::prelude::*;
use web_sys::console;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn convert(file_data: &[u8], to_format: &str)-> Vec<u8> {
    // panic::set_hook(Box::new(console_error_panic_hook::hook));
    let img = image::load_from_memory(file_data).unwrap();
    let target_format = ImageOutputFormat::from(ImageFormat::from_extension(to_format).unwrap());
    let mut c: Cursor<Vec<u8>> = Cursor::new(Vec::new());

    image::write_buffer_with_format(
        &mut c,
        img.as_bytes(),
        img.width(),
        img.height(),
        img.color(),
        target_format
    );

    return c.into_inner()
}

#[wasm_bindgen]
pub fn resize(file_data: &[u8], width: u32, height: u32)-> Vec<u8> {
    let img = image::load_from_memory(file_data).unwrap();
    let resized_img = img.resize_exact(width, height, FilterType::Nearest);

    return resized_img.into_bytes()
}
