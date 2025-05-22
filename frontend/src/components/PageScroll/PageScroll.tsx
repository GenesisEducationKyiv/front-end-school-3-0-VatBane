import "./PageScroll.css"

interface Props {
    page: number,
    totalPages: number,
    updatePagination: (page: number) => void;
}

export const PageScroll = (props: Props) => {
    return (
        <div className='page-scroll-container' data-testid="pagination">
            <div className={"page-scroll"}>
                <span className='page-number'
                      onClick={() => {
                          props.updatePagination(props.page - 1)
                      }}
                      data-testid="pagination-prev"
                >
                    &laquo;
                </span>

                {Array.from({length: props.totalPages}, (_, i) => (
                    <span className={`page-number ${props.page === i + 1 ? "selected-page" : ""}`} key={i}
                          onClick={() => {
                              props.updatePagination(i + 1)
                          }}>{i + 1}</span>
                ))}

                <span className='page-number'
                      onClick={() => {
                          props.updatePagination(props.page + 1)
                      }}
                      data-testid="pagination-next"
                >
                    &raquo;
                </span>

            </div>
        </div>
    )
}
