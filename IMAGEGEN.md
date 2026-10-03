# Обработка фотографий

Встроенный imagegen; 2 октября 2026 года. Все шесть фотографий обработаны отдельно с исходным файлом в качестве edit target. Увеличение детализации и разрешения, мягкое устранение JPEG-артефактов, сохранение сцены, ракурса и основных объектов. Это генеративная обработка: пиксельная идентичность и точность мелких деталей не гарантируются.

Первый кадр `public/images/hero-training.jpg` не изменялся в этой задаче. Логотип и иконки не являются фотографиями и не обрабатывались. Исходные JPEG сохранены рядом с версиями `*-upscaled.jpg`. PNG-результаты перекодированы в JPEG с качеством 92 для сайта, без дополнительного увеличения размера.

| Файл на сайте | Исходник | Результат |
| --- | --- | --- |
| `public/images/coach-artem-upscaled.jpg` | 891 × 1280 | 1046 × 1503 |
| `public/images/hall-1-upscaled.jpg` | 1280 × 612 | 1813 × 868 |
| `public/images/hall-2-upscaled.jpg` | 1280 × 612 | 1814 × 867 |
| `public/images/module-1-upscaled.jpg` | 1280 × 612 | 1814 × 867 |
| `public/images/module-2-upscaled.jpg` | 1280 × 612 | 1814 × 867 |
| `public/images/module-3-upscaled.jpg` | 1280 × 612 | 1814 × 867 |

## Точные запросы imagegen

### coach-artem

```text
Use case: identity-preserve. Edit target: the attached original portrait photograph of coach Артём Трофимов. Perform a strictly faithful photographic super-resolution upscale, preferably 1782 x 2560 pixels (2x original 891 x 1280). This is restoration, NOT a regenerated portrait. Preserve exactly the same person, facial identity, face shape, eyebrows, eyes, gaze, lips, smile, hairstyle, hairline, beard stubble, age, skin features, pose, neck, shoulders, black JÖGEL shirt, its exact existing white mark and lettering, gray background, original lighting and colors. Keep the original aspect ratio, framing, viewpoint and all original content. Only improve real image detail, clean existing compression artifacts gently, and resolve fine hair and fabric texture. No beautification, reshaping, skin smoothing, relighting, new objects, invented text, cropping or restyling. The output must look like the identical source photograph at higher resolution.
```

### hall-1

```text
Use case: precise-object-edit. Edit target: the attached actual photograph of the school sports hall. Strict faithful super-resolution upscale, aim for 2560 x 1224 pixels, exactly twice the original 1280 x 612 landscape. Preserve the same image and camera viewpoint pixel-aligned: same wooden parquet floor and blue court lines, same goal at back left, same beige walls, doors, windows, benches, tables, nets, ceiling beams and lights, same red banner with the exact existing words МОСКОВСКАЯ ФЕДЕРАЦИЯ ФУТБОЛА and moff.ru. Preserve count, positions, shapes, wear, colors, illumination, perspective and crop of everything. ONLY enhance fine authentic details and reduce JPEG compression artifacts minimally. Do not renovate, clean the room, move or add anything, straighten perspective, change court geometry, recolor, relight, invent lettering or remove wear. Output the identical photograph with higher pixel resolution, no creative reinterpretation.
```

### hall-2

```text
Use case: precise-object-edit. Strict faithful super-resolution restoration of the attached ORIGINAL real venue photograph for a football school website. Increase native image resolution and authentic detail as much as possible, target 2560 x 1224 landscape or higher with the exact original 1280:612 aspect ratio. Match the original scene, viewpoint, framing, layout, illumination and colors. ONLY resolve genuine material texture and remove JPEG compression artifacts, without oversharpening or plastic-looking surfaces. Keep every existing object and its original location, all floor court lines, all wear, wall shapes, ceiling seams, lights, goalposts and nets. Do not renovate, clean, add people or objects, remove clutter, redesign architecture, shift perspective, crop, relight or recolor. This must remain the same real photograph, not a new idealized sports facility.
The hall has a central blue line running toward the far wall and a blue circular center marking. Preserve both with their exact geometry, the parquet, hanging translucent nets, beige wall with gray doors and red cabinets, row of benches, ventilation windows. Preserve the existing red banner and its two logos, and lettering exactly as in the input, including МОСКОВСКАЯ ФЕДЕРАЦИЯ ФУТБОЛА and moff.ru; do not invent or respell text.
```

### module-1

```text
Use case: precise-object-edit. Strict faithful super-resolution restoration of the attached ORIGINAL real venue photograph for a football school website. Increase native image resolution and authentic detail as much as possible, target 2560 x 1224 landscape or higher with the exact original 1280:612 aspect ratio. Match the original scene, viewpoint, framing, layout, illumination and colors. ONLY resolve genuine material texture and remove JPEG compression artifacts, without oversharpening or plastic-looking surfaces. Keep every existing object and its original location, all floor court lines, all wear, wall shapes, ceiling seams, lights, goalposts and nets. Do not renovate, clean, add people or objects, remove clutter, redesign architecture, shift perspective, crop, relight or recolor. This must remain the same real photograph, not a new idealized sports facility.
The photograph is a wide oblique view of an inflatable indoor football dome. Preserve the white fabric roof and its exact curvature, stitch seams and lamp positions, dark green walls, worn green floor and white court markings, far small goal and large close goal on the right, all net strands and objects near walls. Preserve the original off-center framing, floor scratches and uneven surfaces.
```

### module-2

```text
Use case: precise-object-edit. Strict faithful super-resolution restoration of the attached ORIGINAL real venue photograph for a football school website. Increase native image resolution and authentic detail as much as possible, target 2560 x 1224 landscape or higher with the exact original 1280:612 aspect ratio. Match the original scene, viewpoint, framing, layout, illumination and colors. ONLY resolve genuine material texture and remove JPEG compression artifacts, without oversharpening or plastic-looking surfaces. Keep every existing object and its original location, all floor court lines, all wear, wall shapes, ceiling seams, lights, goalposts and nets. Do not renovate, clean, add people or objects, remove clutter, redesign architecture, shift perspective, crop, relight or recolor. This must remain the same real photograph, not a new idealized sports facility.
This is the front-on view of the inflatable football dome: a centered goal at the far wall, white curved roof above dark green walls and a central circle on the worn green floor. Preserve all lines and center seam, the goal and nets, bags against walls, benches, the right-side door and opening, light positions and roof seams. No replacement of floor, no cleanup, no removal of any existing items.
```

### module-3

```text
Use case: precise-object-edit. Strict faithful super-resolution restoration of the attached ORIGINAL real venue photograph for a football school website. Increase native image resolution and authentic detail as much as possible, target 2560 x 1224 landscape or higher with the exact original 1280:612 aspect ratio. Match the original scene, viewpoint, framing, layout, illumination and colors. ONLY resolve genuine material texture and remove JPEG compression artifacts, without oversharpening or plastic-looking surfaces. Keep every existing object and its original location, all floor court lines, all wear, wall shapes, ceiling seams, lights, goalposts and nets. Do not renovate, clean, add people or objects, remove clutter, redesign architecture, shift perspective, crop, relight or recolor. This must remain the same real photograph, not a new idealized sports facility.
This is the wide oblique view of the inflatable football dome with the far goal slightly left of center and a large white circle sweeping across the right foreground. Preserve the scuffed green floor, torn and patched places in the dark green wall on the left, small training goal next to the larger goal, white fabric roof seams and lamps, benches and all existing items. Do not repair or hide the actual patches, tears or wear.
```


## Новые изображения, 3 октября 2026

Обработаны встроенным imagegen. Исходные фотографии и прежний первый кадр сохранены; новые файлы подключены в App.tsx. Тренер-методист: Ираклий Шалвович Геленава.

| Файл | Исходный размер | Фактический результат |
| --- | --- | --- |
| public/images/coach-methodist-field-upscaled.jpg | 537 × 389 | 1474 × 1067 |
| public/images/coach-methodist-portrait-upscaled.jpg | 358 × 358 | 1254 × 1254 |
| public/images/hero-training-uniform.jpg | 1254 × 1254 | 1254 × 1254 |

Изменена только форма трёх детей по присланному образцу. Нейросетевая обработка фотографий тренера восстанавливает детали, поэтому не является побитовым увеличением оригинала.

### hero

```text
Use case: identity-preserve / precise-object-edit. Edit target: image 1 is the football school hero photograph with three children. Image 2 is ONLY the uniform design reference. Change ONLY the football shirts and shorts of all three children to match the reference exactly: rich green short-sleeve shirt with yellow collar and sleeve cuffs, central solid paired vertical yellow stripes with thin green split, flanking narrower vertical yellow stripes that fade around the mid-chest/waist as shown; plain green shorts with yellow hems, without side stripes. White knee socks. Remove existing yellow shoulder stripes and shorts side stripes. Transfer the flat kit design onto realistic draped fabric with natural folds. Preserve each child's exact face, identity, hair, skin, body, pose, shoes, positions, ball, pitch, goal, cones, light, background blur, framing and original square composition. No text, logo, watermark, new people or other changes. Output a high resolution square photo.
```

### coachField

```text
Use case: identity-preserve. Faithful photographic super-resolution upscale of the supplied original 537 x 389 photograph, approximately 2148 x 1556 pixels. Strict restoration, same man with precisely unchanged facial identity, age, face shape, expression, gaze, hairline, hairstyle, skin, pose, proportions, black Adidas FFC jacket, exact existing logos/lettering, green pitch, trees, lighting and colors. Preserve original landscape aspect ratio and framing. Resolve fine hair/fabric detail and gently clean compression artifacts only. No beautification, retouching, reshaping, relighting, cropping, background replacement, new content or invented text.
```

### coachPortrait

```text
Use case: identity-preserve. Faithful photographic super-resolution upscale of the supplied original 358 x 358 square portrait, target approximately 1536 x 1536 pixels. Strict restoration: preserve exactly the same man's identity, age, face shape, eyes, brows, gaze, lips, neutral expression, hairstyle, hairline, stubble, natural skin features, shoulders, white sports polo with existing black stripes, pale gray-blue background, lighting, framing and colors. Only resolve genuine fine hair and fabric detail and gently remove JPEG artifacts. No beautification, skin smoothing, reshaping, new objects, cropping, relighting or restyling. Identical photograph at higher resolution.
```
