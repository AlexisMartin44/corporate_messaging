import React from "react";
import styles from "../../styles/documents/documentTableStyle";
import { lighten, withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import { Button } from "@material-ui/core";

function createData(name, date, url) {
  return { name, date, url };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

const headCells = [
  {
    id: "name",
    disablePadding: false,
    label: "Name",
  },
  { id: "date", disablePadding: false, label: "Date" },
  { id: "url", disablePadding: false, label: "URL" },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map(headCell => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={"default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              className={classes.tableLabel}
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

class DocumentTableComponent extends React.Component {
  constructor(props) {
    super();
    this.state = {
      order: "asc",
      orderBy: "name",
      page: 0,
      rowsPerPage: 5,
      files: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    state.files = props.files;
    return state;
  }

  render() {
    const { classes } = this.props;
    const rows = this.state.files.map(file => {
      const date = new Date(file.date);
      return createData(
        file.name,
        date.toLocaleString(),
        <Button variant="contained" color="secondary" href={file.url}>
          Open
        </Button>
      );
    });

    const handleRequestSort = (event, property) => {
      const isAsc =
        this.state.orderBy === property && this.state.order === "asc";
      this.setState({ order: isAsc ? "desc" : "asc" });
      this.setState({ orderBy: property });
    };

    const handleChangePage = (event, newPage) => {
      this.setState({ page: newPage });
    };

    const handleChangeRowsPerPage = event => {
      this.setState({ rowsPerPage: parseInt(event.target.value, 10) });
      this.setState({ page: 0 });
    };

    const emptyRows =
      this.state.rowsPerPage -
      Math.min(
        this.state.rowsPerPage,
        rows.length - this.state.page * this.state.rowsPerPage
      );

    return (
      <div className={classes.centerRoot}>
        <div className={classes.root}>
          <Paper className={classes.paper}>
            <TableContainer>
              <Table
                className={classes.table}
                aria-labelledby="tableTitle"
                size={"medium"}
                aria-label="enhanced table"
              >
                <EnhancedTableHead
                  classes={classes}
                  order={this.state.order}
                  orderBy={this.state.orderBy}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {stableSort(
                    rows,
                    getComparator(this.state.order, this.state.orderBy)
                  )
                    .slice(
                      this.state.page * this.state.rowsPerPage,
                      this.state.page * this.state.rowsPerPage +
                      this.state.rowsPerPage
                    )
                    .map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow hover tabIndex={-1} key={row.name}>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="default"
                          >
                            {row.name}
                          </TableCell>
                          <TableCell align="center">{row.date}</TableCell>
                          <TableCell align="center">{row.url}</TableCell>
                        </TableRow>
                      );
                    })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={rows.length}
              rowsPerPage={this.state.rowsPerPage}
              page={this.state.page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
            />
          </Paper>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(DocumentTableComponent);
