import { getCachedDocument } from "../../utils/documentCache";
import DocumentSkeleton from "../Skeletons/DocumentSkeleton";

interface DocumentPreviewProps {
    src: string;
    page?: number;
}

const DocumentPreview = ({ src, page = 1 }: DocumentPreviewProps) => {
    const cached = getCachedDocument(src);
    return cached?.preview && page === 1 ? (
        <div role="status" aria-label="Loading document" className="w-full">
            <span className="sr-only">Loading document</span>
            <img
                src={cached.preview.url}
                alt=""
                aria-hidden="true"
                width={cached.preview.width}
                height={cached.preview.height}
                className="h-auto w-full"
            />
        </div>
    ) : (
        <DocumentSkeleton aspectRatio={cached?.aspectRatio} />
    );
};

export default DocumentPreview;
