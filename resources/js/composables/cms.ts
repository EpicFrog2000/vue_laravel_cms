import {
    PageSettings,
    actionResponse,
    defaultPageSettings,
} from '@/types/cmsTypes';

export async function saveCmsData(cms_data: any): Promise<actionResponse> {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (!token)
        return <actionResponse>{
            status_ok: false,
            message: 'csrf_token not found',
        };

    const slug = window.location.pathname.replace(/^\/|\/$/g, '') || '/';

    try {
        const res = await fetch('/api/updateCmsData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': token,
            },
            body: JSON.stringify({ data: cms_data, slug: slug }),
        });

        if (!res.ok) {
            const text = await res.text();
            return <actionResponse>{
                status_ok: false,
                message: text || `http_${res.status}`,
            };
        }

        const data = await res.json().catch(() => null);
        return <actionResponse>{ status_ok: true };
    } catch {
        return <actionResponse>{ status_ok: false, message: 'network_error' };
    }
}

export async function getFiles(): Promise<actionResponse> {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (!token)
        return <actionResponse>{
            status_ok: false,
            message: 'csrf_token not found',
            data: [],
        };

    try {
        const res = await fetch('/api/getFilesList', {
            method: 'GET',
        });

        if (!res.ok) {
            const text = await res.text();
            return <actionResponse>{
                status_ok: false,
                message: text || `http_${res.status}`,
                data: [],
            };
        }

        const data = await res.json().catch(() => null);
        return <actionResponse>{ status_ok: true, data: data ?? [] };
    } catch {
        return <actionResponse>{
            status_ok: false,
            message: 'network_error',
            data: [],
        };
    }
}

export async function uploadImages(fileList: any): Promise<actionResponse> {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (!token)
        return <actionResponse>{
            status_ok: false,
            message: 'csrf_token not found',
        };

    const chunkSize = 1024 * 1024 * 2;

    for (const file of fileList) {
        let start = 0;
        while (start < file.size) {
            const chunk = file.slice(start, start + chunkSize);
            const formData = new FormData();
            formData.append('chunk', chunk);
            formData.append('filename', file.name);
            formData.append('start', start.toString());

            try {
                const res = await fetch('/api/uploadFile', {
                    method: 'POST',
                    headers: { 'X-CSRF-TOKEN': token },
                    body: formData,
                    credentials: 'same-origin',
                });
                if (!res.ok) {
                    const text = await res.text();
                    return <actionResponse>{
                        status_ok: false,
                        message: text || `http_${res.status}`,
                    };
                }
            } catch {
                return <actionResponse>{
                    status_ok: false,
                    message: 'network_error',
                };
            }

            start += chunkSize;
        }
    }

    return <actionResponse>{ status_ok: true };
}

export async function getPagesList(): Promise<actionResponse> {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (!token)
        return <actionResponse>{
            status_ok: false,
            message: 'csrf_token not found',
            data: [],
        };

    try {
        const res = await fetch(`/api/getPagesList`, {
            method: 'GET',
            headers: {
                'X-CSRF-TOKEN': token,
            },
        });

        if (!res.ok) {
            const text = await res.text();
            return <actionResponse>{
                status_ok: false,
                message: text || `http_${res.status}`,
                data: [],
            };
        }

        const data = await res.json().catch(() => null);

        return <actionResponse>{ status_ok: true, data: data ?? [] };
    } catch {
        return <actionResponse>{
            status_ok: false,
            message: 'network_error',
            data: [],
        };
    }
}

export async function getPageSettings(slug: string): Promise<actionResponse> {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (!token)
        return <actionResponse>{
            status_ok: false,
            message: 'csrf_token not found',
            data: defaultPageSettings,
        };

    try {
        const res = await fetch(
            `/api/getPageSettings?slug=${encodeURIComponent(slug)}`,
            {
                method: 'GET',
                headers: {
                    'X-CSRF-TOKEN': token,
                },
            },
        );

        if (!res.ok) {
            const text = await res.text();
            return <actionResponse>{
                status_ok: false,
                message: text || `http_${res.status}`,
                data: defaultPageSettings,
            };
        }

        const data = await res.json().catch(() => null);

        return <actionResponse>{
            status_ok: true,
            data: { ...defaultPageSettings, ...data },
        };
    } catch {
        return <actionResponse>{
            status_ok: false,
            message: 'network_error',
            data: defaultPageSettings,
        };
    }
}

export async function savePageSettings(
    slug: string,
    settings: PageSettings,
): Promise<actionResponse> {
    const token = document
        .querySelector('meta[name="csrf-token"]')
        ?.getAttribute('content');
    if (!token)
        return <actionResponse>{
            status_ok: false,
            message: 'csrf_token not found',
        };

    try {
        const res = await fetch('/api/savePageSettings', {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ slug, settings }),
        });

        if (!res.ok) {
            const text = await res.text();
            return <actionResponse>{
                status_ok: false,
                message: text || `http_${res.status}`,
            };
        }

        const data = await res.json().catch(() => null);
        return <actionResponse>{
            status_ok: true,
            message: data?.message ?? 'Zapisano ustawienia strony',
        };
    } catch {
        return <actionResponse>{ status_ok: false, message: 'network_error' };
    }
}
